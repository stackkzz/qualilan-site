-- Função interna da Supabase (opção "RLS automático"); não deve ser chamável pela API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
