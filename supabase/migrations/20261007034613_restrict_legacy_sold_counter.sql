-- Provider version aligned after isolated CLI-generated migration application.
-- Preserve internal operation; prevent untrusted direct counter writes.
begin;
alter function public.increment_drop_sold(uuid,integer) set search_path='';
revoke all on function public.increment_drop_sold(uuid,integer) from public,anon,authenticated;
grant execute on function public.increment_drop_sold(uuid,integer) to service_role;
commit;
