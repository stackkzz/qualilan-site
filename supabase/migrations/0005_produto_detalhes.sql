-- Detalhes trazidos da loja antiga: código do fabricante, unidade de venda e subcategoria.
-- source_name guarda o nome original do sistema; name passa a ser o nome de exibição revisado.
alter table public.products
  add column mfr_code text check (length(mfr_code) <= 60),
  add column unit text check (length(unit) <= 60),
  add column subcategory text check (length(subcategory) <= 60),
  add column source_name text;
