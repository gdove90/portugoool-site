-- GOAL only: oexibflpshttgzmdvhpr. Apply using the established SQL editor
-- after preview verification. Additive tracking storage; no commerce writes.
begin;

create table public.carrier_tracking_packages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  carrier text not null,
  tracking_number text not null check (length(tracking_number) between 5 and 100),
  environment text not null check (environment = 'production'),
  tracker_id text,
  state text not null default 'pending' check (state in ('pending','ready','retry','review')),
  snapshot jsonb,
  provider_updated_at timestamptz,
  last_synced_at timestamptz,
  registration_started_at timestamptz,
  attempts integer not null default 0,
  lease_token uuid,
  lease_until timestamptz,
  next_attempt_at timestamptz not null default now(),
  last_error text,
  created_at timestamptz not null default now(),
  unique(order_id, carrier, tracking_number, environment),
  unique(environment, tracker_id)
);
create index carrier_tracking_due on public.carrier_tracking_packages(next_attempt_at) where state <> 'review';
create table public.carrier_tracking_events (
  package_id uuid not null references public.carrier_tracking_packages(id),
  event_id text not null,
  event jsonb not null,
  provider_updated_at timestamptz not null,
  primary key(package_id, event_id)
);
create table public.carrier_tracking_inbox (
  event_id text not null,
  environment text not null check (environment = 'production'),
  tracker_id text not null,
  snapshot jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  primary key(environment, event_id)
);
create index carrier_tracking_pending_inbox on public.carrier_tracking_inbox(environment, tracker_id) where processed_at is null;
create table public.carrier_tracking_limits (
  key text primary key,
  count integer not null default 1,
  expires_at timestamptz not null default now() + interval '20 minutes'
);
alter table public.carrier_tracking_packages enable row level security;
alter table public.carrier_tracking_events enable row level security;
alter table public.carrier_tracking_inbox enable row level security;
alter table public.carrier_tracking_limits enable row level security;
revoke all on public.carrier_tracking_packages, public.carrier_tracking_events, public.carrier_tracking_inbox, public.carrier_tracking_limits from public, anon, authenticated;
grant all on public.carrier_tracking_packages, public.carrier_tracking_events, public.carrier_tracking_inbox, public.carrier_tracking_limits to service_role;

create function public.carrier_tracking_rate(p_key text) returns integer
language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
  if p_key !~ '^[0-9a-f]{64}$' then raise exception 'Invalid bucket'; end if;
  delete from public.carrier_tracking_limits where expires_at < now();
  insert into public.carrier_tracking_limits as bucket(key) values(p_key)
    on conflict(key) do update set count = bucket.count + 1 returning count into n;
  return n;
end $$;

create function public.carrier_tracking_discover(p_limit integer default 100, p_lookback_days integer default 30) returns integer
language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
  if p_limit is null or p_lookback_days is null or p_limit not between 1 and 100 or p_lookback_days not between 1 and 30 then raise exception 'Invalid discovery bounds'; end if;
  with candidates as (
    select distinct s.order_id, s.received_at,
      case regexp_replace(lower(coalesce(s.tracking_company,'')), '[^a-z0-9]', '', 'g')
        when 'usps' then 'USPS' when 'unitedstatespostalservice' then 'USPS' when 'uspostalservice' then 'USPS'
        when 'ups' then 'UPS' when 'unitedparcelservice' then 'UPS'
        when 'fedex' then 'FedEx' when 'federalexpress' then 'FedEx'
        when 'dhl' then 'DHLExpress' when 'dhlexpress' then 'DHLExpress'
        when 'dhlglobalmail' then 'DHLGlobalMail' when 'dhlecommerce' then 'DHLGlobalMail' when 'dhlecommerceus' then 'DHLGlobalMail'
      end as carrier,
      upper(regexp_replace(number.value #>> '{}', '\s', '', 'g')) as tracking_number
    from public.order_shipments s join public.orders o on o.id = s.order_id
    cross join lateral jsonb_array_elements(case when jsonb_typeof(s.tracking_numbers) = 'array' then s.tracking_numbers else '[]'::jsonb end) number(value)
    where o.livemode = true and o.status = 'paid'
      and lower(s.status) in ('success','shipped','delivered')
      and s.received_at >= now() - make_interval(days => p_lookback_days)
      and jsonb_typeof(number.value) = 'string'
  ), bounded as (
    select c.order_id,c.carrier,c.tracking_number,max(c.received_at) as received_at from candidates c
    where c.carrier is not null and c.tracking_number ~ '^[A-Z0-9-]{5,100}$'
      and not exists (select 1 from public.carrier_tracking_packages p where p.order_id = c.order_id
        and p.carrier = c.carrier and p.tracking_number = c.tracking_number and p.environment = 'production')
    group by c.order_id,c.carrier,c.tracking_number order by max(c.received_at) desc limit p_limit
  )
  insert into public.carrier_tracking_packages(order_id,carrier,tracking_number,environment)
    select order_id,carrier,tracking_number,'production' from bounded on conflict do nothing;
  get diagnostics n = row_count;
  return n;
end $$;

create function public.carrier_tracking_claim(p_lease uuid, p_limit integer default 2)
returns setof public.carrier_tracking_packages language plpgsql security invoker set search_path = '' as $$
begin
  if p_lease is null or p_limit is null or p_limit not between 1 and 2 then raise exception 'Invalid claim bounds'; end if;
  return query with due as (
    select id from public.carrier_tracking_packages
    where state <> 'review' and next_attempt_at <= now() and (lease_until is null or lease_until < now())
      and created_at > now() - interval '60 days'
    order by (tracker_id is null) desc, next_attempt_at for update skip locked limit p_limit
  ) update public.carrier_tracking_packages p set lease_token = p_lease, lease_until = now() + interval '2 minutes', attempts = attempts + 1
    from due where p.id = due.id returning p.*;
end $$;

create function public.carrier_tracking_start(p_id uuid, p_lease uuid) returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  update public.carrier_tracking_packages set registration_started_at = coalesce(registration_started_at, now())
    where id = p_id and lease_token = p_lease and lease_until > now();
  if not found then raise exception 'Lease lost'; end if;
  return true;
end $$;

-- Invoked only as service_role; ownership + environment + version checked again
-- inside this transaction. No status ordering: newer carrier corrections win.
create function public.carrier_tracking_apply(p_id uuid, p_snapshot jsonb) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare p public.carrier_tracking_packages; version timestamptz; event jsonb;
begin
  select * into p from public.carrier_tracking_packages where id = p_id for update;
  if not found or p_snapshot->>'trackerId' is distinct from p.tracker_id
    or p_snapshot->>'mode' is distinct from p.environment
    or upper(p_snapshot->>'carrier') is distinct from upper(p.carrier)
    or upper(regexp_replace(p_snapshot->>'trackingNumber','\s','','g')) is distinct from p.tracking_number
    then raise exception 'Tracker ownership mismatch'; end if;
  version := (p_snapshot->>'updatedAt')::timestamptz;
  if version is null then raise exception 'Missing provider version'; end if;
  for event in select value from jsonb_array_elements(p_snapshot->'events') loop
    insert into public.carrier_tracking_events(package_id,event_id,event,provider_updated_at)
      values(p_id,event->>'id',event,version)
      on conflict(package_id,event_id) do update set event = excluded.event, provider_updated_at = excluded.provider_updated_at
      where excluded.provider_updated_at > carrier_tracking_events.provider_updated_at;
  end loop;
  if p.provider_updated_at is null or version > p.provider_updated_at then
    update public.carrier_tracking_packages set snapshot = p_snapshot, provider_updated_at = version where id = p_id;
  end if;
  update public.carrier_tracking_packages set last_synced_at = now() where id = p_id;
  return true;
end $$;

create function public.carrier_tracking_receive(p_event_id text, p_environment text, p_snapshot jsonb) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare inbox public.carrier_tracking_inbox; package_id uuid;
begin
  if p_environment <> 'production' or p_snapshot->>'mode' <> p_environment
    or p_event_id !~ '^evt_[A-Za-z0-9]+$' or p_snapshot->>'trackerId' !~ '^trk_[A-Za-z0-9]+$'
    then raise exception 'Invalid tracking event'; end if;
  -- Keep package-before-inbox lock order, matching finish. An unknown mapping
  -- is retained and periodically reconciled, including a concurrent mapping race.
  select id into package_id from public.carrier_tracking_packages
    where environment = p_environment and tracker_id = p_snapshot->>'trackerId' for update;
  insert into public.carrier_tracking_inbox(event_id,environment,tracker_id,snapshot)
    values(p_event_id,p_environment,p_snapshot->>'trackerId',p_snapshot) on conflict do nothing;
  select * into inbox from public.carrier_tracking_inbox where event_id = p_event_id and environment = p_environment for update;
  if inbox.processed_at is not null then return true; end if;
  if package_id is null then return false; end if; -- Durable early webhook, reconciled by finish.
  perform public.carrier_tracking_apply(package_id, inbox.snapshot);
  update public.carrier_tracking_inbox set processed_at = now() where event_id = p_event_id and environment = p_environment;
  return true;
end $$;

create function public.carrier_tracking_reconcile_inbox() returns integer
language plpgsql security invoker set search_path = '' as $$
declare inbox public.carrier_tracking_inbox; n integer := 0;
begin
  for inbox in select i.* from public.carrier_tracking_inbox i
    join public.carrier_tracking_packages p on p.tracker_id = i.tracker_id and p.environment = i.environment
    where i.processed_at is null order by i.received_at limit 100 loop
    perform public.carrier_tracking_receive(inbox.event_id,inbox.environment,inbox.snapshot);
    n := n + 1;
  end loop;
  return n;
end $$;

create function public.carrier_tracking_finish(p_id uuid, p_lease uuid, p_snapshot jsonb) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare p public.carrier_tracking_packages; inbox public.carrier_tracking_inbox;
begin
  select * into p from public.carrier_tracking_packages where id = p_id for update;
  if not found or p_lease is null or p.lease_until is null or p.lease_token is distinct from p_lease or p.lease_until <= now() then raise exception 'Lease lost'; end if;
  if p.tracker_id is not null and p.tracker_id is distinct from p_snapshot->>'trackerId' then raise exception 'Tracker changed'; end if;
  update public.carrier_tracking_packages set tracker_id = p_snapshot->>'trackerId' where id = p_id;
  perform public.carrier_tracking_apply(p_id,p_snapshot);
  -- Lock order stays package then inbox for worker and webhook to avoid deadlock.
  for inbox in select * from public.carrier_tracking_inbox where tracker_id = p_snapshot->>'trackerId'
    and environment = p.environment and processed_at is null order by received_at for update loop
    perform public.carrier_tracking_apply(p_id, inbox.snapshot);
    update public.carrier_tracking_inbox set processed_at = now() where environment = inbox.environment and event_id = inbox.event_id;
  end loop;
  update public.carrier_tracking_packages set state = 'ready', attempts = 0, last_error = null,
    lease_token = null, lease_until = null, next_attempt_at = now() + interval '24 hours' where id = p_id;
  return true;
end $$;

create function public.carrier_tracking_fail(p_id uuid, p_lease uuid, p_review boolean, p_code text) returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  update public.carrier_tracking_packages set state = case when p_review then 'review' else 'retry' end,
    last_error = case when p_code = 'provider_rejected' then p_code else 'registration_or_sync_unavailable' end,
    next_attempt_at = now() + make_interval(secs => least(86400, 600 * (2 ^ least(attempts,7))::integer)),
    lease_token = null, lease_until = null where id = p_id and lease_token = p_lease;
  return found;
end $$;

create function public.carrier_tracking_health() returns jsonb
language sql security invoker set search_path = '' as $$
  select jsonb_build_object(
    'review', (select count(*) from public.carrier_tracking_packages where state = 'review'),
    'pendingRetry', (select count(*) from public.carrier_tracking_packages where state = 'retry'),
    'stale', (select count(*) from public.carrier_tracking_packages where tracker_id is not null and last_synced_at < now() - interval '2 days'),
    'unmappedWebhooks', (select count(*) from public.carrier_tracking_inbox where processed_at is null and received_at < now() - interval '10 minutes')
  );
$$;

-- PostgreSQL grants EXECUTE to PUBLIC by default: explicitly revoke every new RPC.
revoke all on function public.carrier_tracking_rate(text), public.carrier_tracking_discover(integer,integer),
  public.carrier_tracking_claim(uuid,integer), public.carrier_tracking_start(uuid,uuid), public.carrier_tracking_apply(uuid,jsonb),
  public.carrier_tracking_receive(text,text,jsonb), public.carrier_tracking_finish(uuid,uuid,jsonb),
  public.carrier_tracking_fail(uuid,uuid,boolean,text), public.carrier_tracking_health(), public.carrier_tracking_reconcile_inbox() from public, anon, authenticated;
grant execute on function public.carrier_tracking_rate(text), public.carrier_tracking_discover(integer,integer),
  public.carrier_tracking_claim(uuid,integer), public.carrier_tracking_start(uuid,uuid), public.carrier_tracking_apply(uuid,jsonb),
  public.carrier_tracking_receive(text,text,jsonb), public.carrier_tracking_finish(uuid,uuid,jsonb),
  public.carrier_tracking_fail(uuid,uuid,boolean,text), public.carrier_tracking_health(), public.carrier_tracking_reconcile_inbox() to service_role;
commit;
