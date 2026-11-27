-- Área do cliente: perfil e histórico de orçamentos ligados à conta (login opcional, por link no e-mail).

create table public.customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text check (length(name) <= 120),
  company text check (length(company) <= 160),
  cnpj text check (length(cnpj) <= 20),
  phone text check (length(phone) <= 40),
  updated_at timestamptz not null default now()
);
alter table public.customers enable row level security;

create trigger customers_touch before update on public.customers
  for each row execute function public.touch_updated_at();

create policy "cliente lê o próprio perfil" on public.customers
  for select to authenticated using (user_id = (select auth.uid()));
create policy "cliente cria o próprio perfil" on public.customers
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "cliente edita o próprio perfil" on public.customers
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "admin lê clientes" on public.customers
  for select to authenticated using ((select public.is_admin()));

grant select, insert, update on public.customers to authenticated;

-- Pedidos: dono (quando logado) e canal. Envios pelo WhatsApp de quem está logado entram só para o histórico,
-- já como "respondido" (a conversa segue no WhatsApp; não aparecem como pendência no painel).
alter table public.quote_requests
  add column user_id uuid references auth.users (id) on delete set null,
  add column channel text not null default 'email' check (channel in ('email', 'whatsapp'));
create index quote_requests_user_idx on public.quote_requests (user_id, created_at desc);

drop policy "visitante envia pedido" on public.quote_requests;
create policy "visitante envia pedido" on public.quote_requests
  for insert to anon, authenticated
  with check (
    ((channel = 'email' and status = 'novo') or (channel = 'whatsapp' and status = 'respondido'))
    and (user_id is null or user_id = (select auth.uid()))
  );
create policy "cliente lê os próprios pedidos" on public.quote_requests
  for select to authenticated using (user_id = (select auth.uid()));
