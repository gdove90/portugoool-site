-- READ ONLY. Run in GOOOL project oexibflpshttgzmdvhpr.
-- Do not use scripts/verify-db-schema.sql on production; that harness INSERTS test rows.
with expected(table_name) as (values ('products'),('orders'),('order_items'),('stripe_events'),('order_shipments'))
select e.table_name, t.table_name is not null as table_exists
from expected e left join information_schema.tables t on t.table_schema='public' and t.table_name=e.table_name;
with expected(column_name) as (values ('livemode'),('submission_attempt_id'),('submission_status'),('lookup_token'),('stripe_payment_intent'),('amount_shipping_cents'),('amount_tax_cents'))
select e.column_name,c.column_name is not null as column_exists
from expected e left join information_schema.columns c on c.table_schema='public' and c.table_name='orders' and c.column_name=e.column_name;
select c.relname as table_name,c.relrowsecurity as rls_enabled from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname in ('orders','order_items','stripe_events','order_shipments');
-- Run after confirming public.products exists. Public catalog fields only; no customer/order data.
select id,slug,price_cents,available_for_sale from public.products where id::text like '80000000-%' order by id;
-- Migration0027 can reset existing price/image values on conflict. Inspect actual state before applying.
