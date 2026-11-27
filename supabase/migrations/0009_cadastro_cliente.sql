-- Cadastro de cliente no mesmo modelo da loja antiga (Magento): pessoa física ou jurídica, documentos e endereço.
alter table public.customers
  add column person_type text check (person_type in ('pf', 'pj')),
  add column last_name text check (length(last_name) <= 120),
  add column cpf text check (length(cpf) <= 14),
  add column rg_ie text check (length(rg_ie) <= 30),
  add column cep text check (length(cep) <= 9),
  add column street text check (length(street) <= 160),
  add column number text check (length(number) <= 20),
  add column complement text check (length(complement) <= 80),
  add column district text check (length(district) <= 80),
  add column city text check (length(city) <= 80),
  add column state text check (length(state) = 2),
  add column newsletter boolean not null default false;
