-- Limite de inserções nas tabelas que o público pode escrever (pedidos e eventos).
-- Barra enxurradas mesmo de quem chama a API do Supabase direto, sem passar pelo site.
-- Limite global por janela de tempo (não por IP: o banco não vê o IP do visitante).
create or replace function public.limit_inserts()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent int;
begin
  execute format('select count(*) from public.%I where created_at > now() - %L::interval', tg_table_name, tg_argv[1])
    into recent;
  if recent >= tg_argv[0]::int then
    raise exception 'Muitas requisições em pouco tempo. Tente novamente em alguns minutos.' using errcode = '53400';
  end if;
  return new;
end;
$$;
revoke all on function public.limit_inserts() from public, anon, authenticated;

-- Pedidos por e-mail: até 30 a cada 10 minutos no site inteiro.
create trigger quote_requests_rate before insert on public.quote_requests
  for each row execute function public.limit_inserts('30', '10 minutes');

-- Eventos de métricas: até 600 por minuto no site inteiro.
create trigger site_events_rate before insert on public.site_events
  for each row execute function public.limit_inserts('600', '1 minute');
