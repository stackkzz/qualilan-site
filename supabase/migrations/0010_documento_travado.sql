-- Documento do cliente (CPF/CNPJ e tipo) não muda depois de gravado: troca só pela equipe (admin).
create or replace function public.lock_customer_document()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if (old.cpf is not null or old.cnpj is not null)
     and (new.person_type is distinct from old.person_type
          or new.cpf is distinct from old.cpf
          or new.cnpj is distinct from old.cnpj)
     and not public.is_admin() then
    raise exception 'documento_travado' using errcode = 'P0001';
  end if;
  return new;
end $$;

create trigger customers_lock_document before update on public.customers
  for each row execute function public.lock_customer_document();

-- Excluir a própria conta (LGPD). O perfil sai junto (on delete cascade); os pedidos ficam sem dono (set null).
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'sem_sessao';
  end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
