-- Assertions against the migrated schema (0001 + 0026). Run inside a
-- throwaway Postgres; every DO block raises on failure, so a clean run
-- (exit 0, all NOTICEs) is the evidence.

\set ON_ERROR_STOP on

-- seed a product row so order_items FK can point somewhere real
insert into public.products (id, name, slug, price_cents)
values ('70000000-0000-4000-8000-000000000001', 'GOOOL Performance Badge Tee', 'goool-performance-tee', 4800);

-- 1. orders.stripe_session_id uniqueness (order-level idempotency)
do $$
declare dup boolean := false;
begin
  insert into public.orders (stripe_session_id, status, total_cents, submission_status)
  values ('cs_test_dupe', 'paid', 4800, 'pending_submission');
  begin
    insert into public.orders (stripe_session_id, status, total_cents)
    values ('cs_test_dupe', 'paid', 4800);
  exception when unique_violation then dup := true;
  end;
  if not dup then raise exception 'FAIL: duplicate stripe_session_id was accepted'; end if;
  raise notice 'PASS: duplicate stripe_session_id rejected (unique_violation)';
end $$;

-- 2. stripe_events primary-key dedupe
do $$
declare dup boolean := false;
begin
  insert into public.stripe_events (id, type) values ('evt_1', 'checkout.session.completed');
  begin
    insert into public.stripe_events (id, type) values ('evt_1', 'checkout.session.completed');
  exception when unique_violation then dup := true;
  end;
  if not dup then raise exception 'FAIL: duplicate stripe event id accepted'; end if;
  raise notice 'PASS: duplicate stripe event id rejected';
end $$;

-- 3. submission_status check constraint
do $$
declare blocked boolean := false;
begin
  begin
    update public.orders set submission_status = 'bogus_state' where stripe_session_id = 'cs_test_dupe';
  exception when check_violation then blocked := true;
  end;
  if not blocked then raise exception 'FAIL: invalid submission_status accepted'; end if;
  raise notice 'PASS: submission_status check constraint enforced';
end $$;

-- 4. CAS lock semantics: the guarded UPDATE wins exactly once
do $$
declare n1 int; n2 int;
begin
  update public.orders set submission_status = 'submitting'
    where stripe_session_id = 'cs_test_dupe' and submission_status = 'pending_submission';
  get diagnostics n1 = row_count;
  update public.orders set submission_status = 'submitting'
    where stripe_session_id = 'cs_test_dupe' and submission_status = 'pending_submission';
  get diagnostics n2 = row_count;
  if n1 <> 1 or n2 <> 0 then
    raise exception 'FAIL: CAS transition rows: first=% second=%', n1, n2;
  end if;
  raise notice 'PASS: compare-and-set transition wins exactly once (1 then 0 rows)';
end $$;

-- 5. order snapshot columns persist and read back intact
do $$
declare r record;
begin
  update public.orders set
    stripe_payment_intent = 'pi_x',
    amount_subtotal_cents = 4800,
    amount_shipping_cents = 950,
    amount_tax_cents = 0,
    shipping_name = 'Test Buyer',
    shipping_address = '{"line1":"1 Stadium Way","city":"Providence","state":"RI","postal_code":"02901","country":"US"}'::jsonb,
    paid_at = now()
  where stripe_session_id = 'cs_test_dupe';
  select * into r from public.orders where stripe_session_id = 'cs_test_dupe';
  if r.shipping_address->>'line1' <> '1 Stadium Way' or r.amount_shipping_cents <> 950 then
    raise exception 'FAIL: snapshot columns did not round-trip';
  end if;
  raise notice 'PASS: order snapshot columns round-trip (jsonb address, amounts)';
end $$;

-- 6. order_items snapshot columns + FK
do $$
declare oid uuid; cnt int;
begin
  select id into oid from public.orders where stripe_session_id = 'cs_test_dupe';
  insert into public.order_items (order_id, product_id, size, color, quantity, unit_price_cents, apliiq_product_id, apliiq_sku)
  values (oid, '70000000-0000-4000-8000-000000000001', 'M', 'True Royal', 1, 4800, 6099129, 'APQ-6099129S7A1');
  select count(*) into cnt from public.order_items where order_id = oid and apliiq_sku = 'APQ-6099129S7A1';
  if cnt <> 1 then raise exception 'FAIL: order_items snapshot row missing'; end if;
  raise notice 'PASS: order_items persists apliiq_sku / apliiq_product_id snapshot';
end $$;

-- 7. shipments FK + cascade
do $$
declare oid uuid; cnt int;
begin
  select id into oid from public.orders where stripe_session_id = 'cs_test_dupe';
  insert into public.order_shipments (order_id, status, tracking_company, tracking_numbers, tracking_urls, line_items)
  values (oid, 'success', 'USPS', '["9400"]'::jsonb, '["https://usps.example"]'::jsonb, '[{"sku":"APQ-6099129S7A1"}]'::jsonb);
  delete from public.orders where id = oid;
  select count(*) into cnt from public.order_shipments where order_id = oid;
  if cnt <> 0 then raise exception 'FAIL: shipment rows survived order delete'; end if;
  raise notice 'PASS: order_shipments row stored and cascade-deleted with order';
end $$;

-- 8. lookup_token: defaulted, unique
do $$
declare t1 uuid; t2 uuid;
begin
  insert into public.orders (stripe_session_id, status, total_cents) values ('cs_tok_1', 'paid', 1);
  insert into public.orders (stripe_session_id, status, total_cents) values ('cs_tok_2', 'paid', 1);
  select lookup_token into t1 from public.orders where stripe_session_id = 'cs_tok_1';
  select lookup_token into t2 from public.orders where stripe_session_id = 'cs_tok_2';
  if t1 is null or t2 is null or t1 = t2 then raise exception 'FAIL: lookup tokens missing or colliding'; end if;
  raise notice 'PASS: lookup_token auto-generates unique values';
end $$;

-- 9. RLS enabled on every order-path table
do $$
declare bad text;
begin
  select string_agg(c.relname, ', ') into bad
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in ('orders','order_items','order_shipments','stripe_events')
    and not c.relrowsecurity;
  if bad is not null then raise exception 'FAIL: RLS disabled on: %', bad; end if;
  raise notice 'PASS: RLS enabled on orders, order_items, order_shipments, stripe_events';
end $$;

select 'ALL SCHEMA ASSERTIONS PASSED' as result;
