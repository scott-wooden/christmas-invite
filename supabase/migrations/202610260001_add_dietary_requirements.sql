begin;

alter table public.rsvps
  add column dietary_requirements text not null default ''
  check (char_length(dietary_requirements) <= 500);

alter table public.rsvps
  add constraint declined_without_dietary_requirements
  check (attendance <> 'no' or dietary_requirements = '');

commit;
