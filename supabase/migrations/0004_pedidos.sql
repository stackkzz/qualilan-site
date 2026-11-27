-- Pedidos de orçamento por e-mail (alternativa ao WhatsApp). Visitante só insere; só admin lê e muda o status.

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 120),
  company text check (length(company) <= 160),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 200),
  phone text check (length(phone) <= 40),
  message text check (length(message) <= 2000),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 200),
  status text not null default 'novo' check (status in ('novo', 'respondido', 'arquivado')),
  created_at timestamptz not null default now()
);
create index quote_requests_created_idx on public.quote_requests (created_at desc);
alter table public.quote_requests enable row level security;

create policy "visitante envia pedido" on public.quote_requests
  for insert to anon, authenticated with check (status = 'novo');
create policy "admin lê pedidos" on public.quote_requests
  for select to authenticated using ((select public.is_admin()));
create policy "admin muda status" on public.quote_requests
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant insert on public.quote_requests to anon, authenticated;
grant select, update on public.quote_requests to authenticated;
