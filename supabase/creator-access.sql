create table if not exists public.creator_access (
    user_id uuid primary key references auth.users (id) on delete cascade,
    authorized_at timestamptz not null default now()
);

alter table public.creator_access enable row level security;

revoke all on table public.creator_access from anon, authenticated;
grant select on table public.creator_access to authenticated;

drop policy if exists "Users can read their own creator access"
    on public.creator_access;

create policy "Users can read their own creator access"
    on public.creator_access
    for select
    to authenticated
    using (auth.uid() = user_id);
