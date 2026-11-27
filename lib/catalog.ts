import { cacheLife, cacheTag } from "next/cache";
import { createSupabasePublicClient } from "./supabase/server";
import { categories } from "./site";

export type Product = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  category: string;
  brand: string | null;
  image: string | null;
  inStock: boolean;
  description: string;
};

export const PRODUCTS_TAG = "products";

type ProductRow = {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  category: string;
  brand: string | null;
  image_url: string | null;
  in_stock: boolean;
  description: string;
};

export function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    sku: r.sku,
    name: r.name,
    category: r.category,
    brand: r.brand,
    image: r.image_url,
    inStock: r.in_stock,
    description: r.description,
  };
}

// Catálogo inteiro em cache; o painel invalida a tag "products" a cada alteração.
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("days");
  const { data, error } = await createSupabasePublicClient()
    .from("products")
    .select("id, slug, sku, name, category, brand, image_url, in_stock, description")
    .eq("published", true)
    .order("name");
  if (error) throw new Error(`Falha ao carregar produtos: ${error.message}`);
  return (data as ProductRow[]).map(toProduct);
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function brandsOf(list: Product[]) {
  return [...new Set(list.map((p) => p.brand).filter((b): b is string => !!b))].sort();
}

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Busca simples: todas as palavras precisam aparecer em nome, marca ou código.
export function searchProducts(
  products: Product[],
  { q, categoria, marca }: { q?: string; categoria?: string; marca?: string },
) {
  const terms = normalize(q ?? "")
    .split(/\s+/)
    .filter(Boolean);
  return products.filter((p) => {
    if (categoria && p.category !== categoria) return false;
    if (marca && p.brand !== marca) return false;
    if (!terms.length) return true;
    const hay = normalize(`${p.name} ${p.brand ?? ""} ${p.sku ?? ""}`);
    return terms.every((t) => hay.includes(t));
  });
}

// Disponíveis primeiro; a loja antiga mostrava esgotados misturados.
export function sortForDisplay(list: Product[]) {
  return [...list].sort((a, b) => Number(b.inStock) - Number(a.inStock));
}
