// Gera supabase/seed.sql a partir de data/products.json (catálogo importado da loja antiga).
// Uso: node scripts/build-seed.mjs
import { readFile, writeFile } from "node:fs/promises";

// Marcas vêm em caixa alta da loja antiga; gravamos no formato oficial.
const BRAND_LABELS = { "TP-LINK": "TP-Link", "CONTROL ID": "Control iD", "O-TECH": "O-Tech", ALM: "ALM", SIL: "SIL" };
const brandLabel = (b) => (b ? (BRAND_LABELS[b] ?? b.charAt(0) + b.slice(1).toLowerCase()) : null);
const lit = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);

const products = JSON.parse(await readFile("data/products.json", "utf8"));
const rows = products.map(
  (p) =>
    `(${lit(p.slug)}, ${lit(p.sku)}, ${lit(p.name)}, ${lit(p.category)}, ${lit(brandLabel(p.brand))}, ${lit(p.image)}, ${p.inStock}, ${lit(p.description ?? "")})`,
);
const sql = `-- Gerado por scripts/build-seed.mjs. Reexecutar é seguro: atualiza pelo slug.
insert into public.products (slug, sku, name, category, brand, image_url, in_stock, description) values
${rows.join(",\n")}
on conflict (slug) do update set
  sku = excluded.sku, name = excluded.name, category = excluded.category, brand = excluded.brand,
  image_url = excluded.image_url, in_stock = excluded.in_stock;
`;
await writeFile("supabase/seed.sql", sql);
console.log(`${rows.length} produtos em supabase/seed.sql (${sql.length} bytes)`);
