-- Additive v84 intake; commerce tables and privileges are unchanged.
begin;
create table public.intake_submissions (
  id uuid primary key, kind text not null check(kind in ('kit','story','video')),
  category text not null, status text not null default 'new' check(status in ('new','reviewing','approved','featured','quoted','closed')),
  state text not null default 'draft' check(state in ('draft','received','deleting')),
  name text not null, email text not null, team text not null default '',
  payload jsonb not null, consent jsonb not null, notes text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), submitted_at timestamptz,
  upload_token_hash text not null, upload_expires_at timestamptz not null
);
create table public.intake_files (
  id uuid primary key, submission_id uuid not null references public.intake_submissions(id) on delete cascade,
  name text not null, mime text not null, size bigint not null check(size between 1 and 104857600),
  object_key text not null unique, purpose text not null,
  state text not null default 'pending' check(state in ('pending','ready'))
);
create table public.intake_rate_limits (key text primary key, count integer not null default 1, expires_at timestamptz not null default now()+interval '2 hours');
create index intake_inbox on public.intake_submissions(submitted_at desc) where state='received';
create index intake_file_submission on public.intake_files(submission_id);
alter table public.intake_submissions enable row level security;
alter table public.intake_files enable row level security;
alter table public.intake_rate_limits enable row level security;
revoke all on public.intake_submissions,public.intake_files,public.intake_rate_limits from public,anon,authenticated;
grant all on public.intake_submissions,public.intake_files,public.intake_rate_limits to service_role;

create function public.intake_rate(p_key text) returns integer language plpgsql security invoker set search_path='' as $$
declare result integer;
begin
 insert into public.intake_rate_limits(key) values(p_key)
 on conflict(key) do update set count=intake_rate_limits.count+1 returning count into result;
 return result;
end $$;

create function public.intake_begin(p_record jsonb,p_files jsonb) returns uuid language plpgsql security invoker set search_path='' as $$
declare identifier uuid := (p_record->>'id')::uuid;
begin
 insert into public.intake_submissions(id,kind,category,name,email,team,payload,consent,upload_token_hash,upload_expires_at)
 values(identifier,p_record->>'kind',p_record->>'category',p_record->>'name',p_record->>'email',p_record->>'team',p_record->'payload',p_record->'consent',p_record->>'upload_token_hash',(p_record->>'upload_expires_at')::timestamptz);
 insert into public.intake_files(id,submission_id,name,mime,size,object_key,purpose)
 select (f->>'id')::uuid,identifier,f->>'name',f->>'mime',(f->>'size')::bigint,f->>'objectKey',f->>'purpose' from jsonb_array_elements(p_files) f;
 return identifier;
end $$;

create function public.intake_finish(p_id uuid,p_token_hash text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare s public.intake_submissions; received timestamptz;
begin
 select * into s from public.intake_submissions where id=p_id for update;
 if not found or s.upload_token_hash<>p_token_hash or s.state='deleting' then return null; end if;
 if s.submitted_at is not null then return jsonb_build_object('id',s.id,'receivedAt',s.submitted_at); end if;
 if s.upload_expires_at<now() then return null; end if;
 received := now();
 update public.intake_files set state='ready' where submission_id=p_id;
 update public.intake_submissions set state='received',submitted_at=received,updated_at=received where id=p_id;
 return jsonb_build_object('id',p_id,'receivedAt',received);
end $$;

create function public.intake_mark_deleting(p_id uuid) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 perform id from public.intake_submissions where id=p_id for update;
 if not found then return false; end if;
 update public.intake_submissions set state='deleting',updated_at=now(),
 name='',email='',team='',payload='{}'::jsonb,consent='{}'::jsonb,notes='' where id=p_id;
 update public.intake_files set name='removed' where submission_id=p_id;
 return true;
end $$;

create function public.intake_counts() returns table(kind text,category text,status text,count bigint) language sql security invoker set search_path='' as $$
 select kind,category,status,count(*) from public.intake_submissions where state='received' group by kind,category,status;
$$;
revoke all on function public.intake_rate(text),public.intake_begin(jsonb,jsonb),public.intake_finish(uuid,text),public.intake_mark_deleting(uuid),public.intake_counts() from public,anon,authenticated;
grant execute on function public.intake_rate(text),public.intake_begin(jsonb,jsonb),public.intake_finish(uuid,text),public.intake_mark_deleting(uuid),public.intake_counts() to service_role;
-- Do not alter products, orders, newsletter tables, order_export or their grants.
-- Pro capacity approved and verified for the existing GOOOL organization.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('goool-intake','goool-intake',false,104857600,
 array['image/png','image/jpeg','image/svg+xml','application/pdf','video/mp4','video/quicktime','video/webm']);
commit;
