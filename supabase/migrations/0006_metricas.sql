-- Eventos do site para as métricas do painel: cliques no WhatsApp, buscas e pedidos por e-mail.
-- Visitante só insere tipos conhecidos, sem dados pessoais; só admin lê.
create table public.site_events (
  id bigint generated always as identity primary key,
  type text not null check (type in ('whatsapp_lista', 'whatsapp_item', 'whatsapp_contato', 'busca', 'pedido_email')),
  path text check (length(path) <= 300),
  query text check (length(query) <= 120),
  items jsonb check (items is null or (jsonb_typeof(items) = 'array' and jsonb_array_length(items) <= 200)),
  created_at timestamptz not null default now()
);
create index site_events_created_idx on public.site_events (created_at desc);
create index site_events_type_idx on public.site_events (type, created_at desc);
alter table public.site_events enable row level security;

create policy "visitante registra evento" on public.site_events
  for insert to anon, authenticated with check (true);
create policy "admin lê eventos" on public.site_events
  for select to authenticated using ((select public.is_admin()));

grant insert on public.site_events to anon, authenticated;
grant select on public.site_events to authenticated;

-- Revisão dos nomes gerados a partir da loja antiga.
alter table public.products add column name_reviewed boolean not null default false;
