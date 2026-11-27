"use server";

import { getProducts } from "@/lib/catalog";

// Dados atuais dos produtos da lista (a lista guarda nome e foto de quando o item entrou; o catálogo pode ter mudado).
export async function currentProducts(slugs: string[]) {
  const wanted = new Set(Array.isArray(slugs) ? slugs.slice(0, 200).map(String) : []);
  return (await getProducts())
    .filter((p) => wanted.has(p.slug))
    .map(({ slug, name, sku, image, unit }) => ({ slug, name, sku, image, unit }));
}
