-- GOAL oexibflpshttgzmdvhpr only. Tracking-only support for one controlled
-- preflight while automatic discovery remains disabled. No commerce writes.
begin;

alter table public.carrier_tracking_packages add column preflight_until timestamptz;

create function public.carrier_tracking_preflight_claim(
  p_shipment_id uuid, p_tracking_index integer, p_lease uuid
) returns setof public.carrier_tracking_packages
language plpgsql security invoker set search_path = '' as $$
declare shipment record; number text; package public.carrier_tracking_packages;
begin
  if p_shipment_id is null or p_lease is null or p_tracking_index is null
    or p_tracking_index not between 0 and 99 then raise exception 'Invalid preflight target'; end if;
  -- Serialize enrollment so repeated requests cannot open separate package targets.
  perform pg_advisory_xact_lock(hashtextextended('GOAL:carrier-tracking-preflight',0));
  select s.order_id,s.tracking_company,s.tracking_numbers,s.status,s.received_at,
    o.created_at as order_created_at,o.status as order_status,o.livemode
    into shipment from public.order_shipments s join public.orders o on o.id = s.order_id
    where s.id = p_shipment_id;
  if not found or shipment.order_status <> 'paid' or shipment.livemode is distinct from true
    or shipment.order_created_at < now() - interval '90 days' or shipment.order_created_at > now()
    or shipment.received_at < now() - interval '30 days'
    or lower(shipment.status) not in ('success','shipped','delivered')
    or regexp_replace(lower(coalesce(shipment.tracking_company,'')),'[^a-z0-9]','','g')
      not in ('usps','unitedstatespostalservice','uspostalservice')
    or jsonb_typeof(shipment.tracking_numbers) is distinct from 'array'
    then raise exception 'Shipment is not eligible for preflight'; end if;
  if p_tracking_index >= jsonb_array_length(shipment.tracking_numbers)
    or jsonb_typeof(shipment.tracking_numbers->p_tracking_index) is distinct from 'string'
    then raise exception 'Invalid preflight number selection'; end if;
  number := upper(regexp_replace(shipment.tracking_numbers->>p_tracking_index,'\s','','g'));
  if number !~ '^[A-Z0-9-]{5,100}$' then raise exception 'Invalid preflight number'; end if;
  if exists(select 1 from public.carrier_tracking_packages p where p.preflight_until > now()
    and not (p.order_id = shipment.order_id and p.carrier = 'USPS'
      and p.tracking_number = number and p.environment = 'production'))
    then raise exception 'Another preflight target is already enrolled'; end if;
  insert into public.carrier_tracking_packages(order_id,carrier,tracking_number,environment,registration_not_before)
    values(shipment.order_id,'USPS',number,'production',shipment.order_created_at) on conflict do nothing;
  select * into package from public.carrier_tracking_packages p
    where p.order_id = shipment.order_id and p.carrier = 'USPS'
      and p.tracking_number = number and p.environment = 'production' for update;
  if package.registration_not_before is distinct from shipment.order_created_at
    then raise exception 'Preflight order window mismatch'; end if;
  if package.state = 'review' or package.attempts >= 6 then raise exception 'Preflight requires operator review'; end if;
  if package.lease_until is not null and package.lease_until > now() then raise exception 'Preflight package is busy'; end if;
  return query update public.carrier_tracking_packages p set
    preflight_until = now() + interval '24 hours', lease_token = p_lease,
    lease_until = now() + interval '2 minutes', attempts = attempts + 1
    where p.id = package.id returning p.*;
end $$;

create function public.carrier_tracking_preflight_receive(
  p_event_id text, p_environment text, p_snapshot jsonb
) returns boolean language plpgsql security invoker set search_path = '' as $$
declare package public.carrier_tracking_packages; event jsonb; created timestamptz;
begin
  if p_environment is distinct from 'production' or p_snapshot->>'mode' is distinct from p_environment
    or p_event_id is null or p_event_id !~ '^evt_[A-Za-z0-9]{1,72}$'
    or p_snapshot->>'trackerId' is null or p_snapshot->>'trackerId' !~ '^trk_[A-Za-z0-9]{1,72}$'
    or upper(p_snapshot->>'carrier') is distinct from 'USPS'
    then raise exception 'Invalid preflight event'; end if;
  select * into package from public.carrier_tracking_packages p where p.preflight_until > now()
    and p.environment = p_environment and p.carrier = 'USPS'
    and p.tracking_number = upper(regexp_replace(p_snapshot->>'trackingNumber','\s','','g')) for update;
  if not found then raise exception 'No enrolled preflight target'; end if;
  if package.tracker_id is not null and package.tracker_id is distinct from p_snapshot->>'trackerId'
    then raise exception 'Preflight tracker ownership mismatch'; end if;
  if exists(select 1 from public.carrier_tracking_packages p where p.environment = p_environment
    and p.tracker_id = p_snapshot->>'trackerId' and p.id <> package.id)
    then raise exception 'Tracker belongs to another package'; end if;
  if p_snapshot->>'createdAt' is null or p_snapshot->>'createdAt' !~ 'T.*(Z|[+-][0-9]{2}:?[0-9]{2})$'
    then raise exception 'Tracker creation time unavailable'; end if;
  created := (p_snapshot->>'createdAt')::timestamptz;
  if created < package.registration_not_before or created > now() + interval '30 seconds'
    then raise exception 'Tracker outside order window'; end if;
  for event in select value from jsonb_array_elements(p_snapshot->'events') loop
    if event->>'occurredAt' ~ 'T.*(Z|[+-][0-9]{2}:?[0-9]{2})$'
      and (event->>'occurredAt')::timestamptz < package.registration_not_before
      then raise exception 'Carrier history predates order'; end if;
  end loop;
  if package.tracker_id is not null then
    return public.carrier_tracking_receive(p_event_id,p_environment,p_snapshot);
  end if;
  -- A pending mapping must not apply an update to any other package while OFF.
  -- finish() reconciles this same durable inbox after its tracker mapping commits.
  insert into public.carrier_tracking_inbox(event_id,environment,tracker_id,snapshot)
    values(p_event_id,p_environment,p_snapshot->>'trackerId',p_snapshot) on conflict do nothing;
  return false;
end $$;

revoke all on function public.carrier_tracking_preflight_claim(uuid,integer,uuid),
  public.carrier_tracking_preflight_receive(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.carrier_tracking_preflight_claim(uuid,integer,uuid),
  public.carrier_tracking_preflight_receive(text,text,jsonb) to service_role;
commit;
