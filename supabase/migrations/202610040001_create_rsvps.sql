begin;

create table public.rsvps (
  id uuid primary key,
  name text not null check (char_length(name) between 1 and 100 and name = btrim(name)),
  attendance text not null check (attendance in ('yes', 'no', 'maybe')),
  plus_one boolean not null,
  needs_room boolean not null,
  created_at timestamptz not null default now(),
  constraint declined_without_extras check (attendance <> 'no' or (not plus_one and not needs_room))
);

alter table public.rsvps enable row level security;
revoke all on table public.rsvps from public, anon, authenticated;
-- The server inserts submissions and reads a matching ID only to verify retries.
revoke all on table public.rsvps from service_role;
grant insert, select on table public.rsvps to service_role;
-- No anonymous policies: the browser must use the validating server endpoint.
comment on table public.rsvps is 'Private Christmas party responses; manage using the Supabase dashboard.';

commit;
