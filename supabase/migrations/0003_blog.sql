-- Blog: posts em Markdown editados pelo painel. Mesmo modelo de acesso dos produtos:
-- público lê os publicados; só quem está em public.admins cria, edita e apaga.

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) between 3 and 200),
  excerpt text not null default '' check (length(excerpt) <= 400),
  category text not null default 'Tecnologia' check (length(category) <= 60),
  cover_url text,
  body text not null default '',
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_published_at_idx on public.posts (published_at desc);
alter table public.posts enable row level security;

create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

create policy "público lê posts publicados" on public.posts
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admin insere posts" on public.posts
  for insert to authenticated with check ((select public.is_admin()));
create policy "admin edita posts" on public.posts
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin apaga posts" on public.posts
  for delete to authenticated using ((select public.is_admin()));

grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
