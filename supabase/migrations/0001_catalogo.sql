-- Catálogo Qualilan: produtos, administradores e fotos.
-- Leitura pública só de produtos publicados; escrita só para quem está em public.admins.

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "admin vê o próprio registro" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));
grant select on public.admins to authenticated;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sku text,
  name text not null check (length(trim(name)) between 2 and 300),
  category text not null check (category in (
    'cabos-lan', 'rede-optica', 'switches', 'wireless', 'cftv', 'controle-de-acesso',
    'cabos-eletricos', 'cabos-telefonicos', 'canaletas', 'conversores', 'iluminacao', 'rotulador-eletronico'
  )),
  brand text,
  image_url text,
  in_stock boolean not null default true,
  description text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products (category);
alter table public.products enable row level security;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

create policy "público lê produtos publicados" on public.products
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admin insere produtos" on public.products
  for insert to authenticated with check ((select public.is_admin()));
create policy "admin edita produtos" on public.products
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin apaga produtos" on public.products
  for delete to authenticated using ((select public.is_admin()));

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

-- Fotos dos produtos: leitura pública, envio só por admin, até 5 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('produtos', 'produtos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

-- remove() do Storage precisa de SELECT para achar o arquivo.
create policy "admin lê fotos" on storage.objects
  for select to authenticated using (bucket_id = 'produtos' and (select public.is_admin()));
create policy "admin envia fotos" on storage.objects
  for insert to authenticated with check (bucket_id = 'produtos' and (select public.is_admin()));
create policy "admin troca fotos" on storage.objects
  for update to authenticated using (bucket_id = 'produtos' and (select public.is_admin()));
create policy "admin apaga fotos" on storage.objects
  for delete to authenticated using (bucket_id = 'produtos' and (select public.is_admin()));
