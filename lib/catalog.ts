import { cacheLife, cacheTag } from "next/cache";
import { createSupabasePublicClient } from "./supabase/server";
import { categories } from "./site";
import type { Sort } from "./sorts";
export { SORTS, parseSort, type Sort } from "./sorts";

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
  mfrCode: string | null;
  unit: string | null;
  subcategory: string | null;
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
  mfr_code?: string | null;
  unit?: string | null;
  subcategory?: string | null;
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
    mfrCode: r.mfr_code ?? null,
    unit: r.unit ?? null,
    subcategory: r.subcategory ?? null,
  };
}

// Catálogo inteiro em cache; o painel invalida a tag "products" a cada alteração.
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("days");
  const { data, error } = await createSupabasePublicClient()
    .from("products")
    .select("id, slug, sku, name, category, brand, image_url, in_stock, description, mfr_code, unit, subcategory")
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

// Nome da marca para exibir e buscar: a Lightera é a antiga Furukawa, e o comprador ainda procura pelo nome antigo.
export function brandLabel(brand: string | null) {
  if (!brand) return "";
  return brand.toLowerCase() === "lightera" ? `${brand} (antiga Furukawa)` : brand;
}

// Categorias com pelo menos um produto publicado: as vazias somem do menu e da Home (a página continua no ar).
export async function listedCategories() {
  const products = await getProducts();
  return categories
    .map((c) => ({ ...c, count: products.filter((p) => p.category === c.slug).length }))
    .filter((c) => c.count > 0);
}

const SUBSTITUTE_CATEGORIES = new Set(["switches", "wireless", "iluminacao", "conversores", "rotulador-eletronico"]);

// Categorias que costumam entrar no mesmo orçamento.
const COMPLEMENTS: Record<string, string[]> = {
  "cabos-lan": ["switches", "rede-optica", "rotulador-eletronico"],
  "rede-optica": ["switches", "cabos-lan", "conversores"],
  switches: ["cabos-lan", "wireless", "rede-optica"],
  wireless: ["switches", "cabos-lan"],
  cftv: ["switches", "cabos-lan", "cabos-eletricos"],
  "controle-de-acesso": ["cftv", "cabos-lan", "cabos-eletricos"],
  "cabos-eletricos": ["iluminacao", "rotulador-eletronico"],
  "cabos-telefonicos": ["cabos-lan", "rotulador-eletronico"],
  conversores: ["rede-optica", "switches"],
  iluminacao: ["cabos-eletricos"],
  "rotulador-eletronico": ["cabos-lan", "cabos-eletricos"],
};

// "Compre junto": até `limit` produtos que completam o orçamento, um por subcategoria (ou categoria).
// Primeiro outras subcategorias da mesma categoria, depois categorias complementares;
// em cada grupo, prefere a mesma marca e o que tem pronta entrega.
export function complementsFor(product: Product, all: Product[], limit = 4) {
  const score = (p: Product) => (p.brand && p.brand === product.brand ? 2 : 0) + (p.inStock ? 1 : 0);
  const groups: Product[][] = [];
  // Mesmo "tipo" = mesma primeira palavra da subcategoria (Cabo Cat.5E e Cabo Cat.6; Câmeras IP e Câmeras Motorola):
  // sugerir outro cabo para quem vê um cabo não completa o orçamento.
  // "Patch cord" e "Patch panel" são tipos diferentes: aí conta a segunda palavra.
  const kind = (s: string | null) => {
    const w = normalize(s ?? "").split(" ");
    return (w[0] === "patch" ? w.slice(0, 2).join(" ") : w[0]).replace(/s$/, "");
  };
  // Nessas categorias as subcategorias são variações do mesmo produto (switch gerenciável x PoE): não complementam.
  const sameCat = SUBSTITUTE_CATEGORIES.has(product.category)
    ? []
    : all.filter((p) => p.category === product.category && p.subcategory && kind(p.subcategory) !== kind(product.subcategory));
  for (const k of new Set(sameCat.map((p) => kind(p.subcategory)))) groups.push(sameCat.filter((p) => kind(p.subcategory) === k));
  for (const cat of COMPLEMENTS[product.category] ?? []) groups.push(all.filter((p) => p.category === cat));
  const picked: Product[] = [];
  for (const g of groups) {
    const best = [...g].sort((a, b) => score(b) - score(a) || byName(a, b))[0];
    if (best && best.slug !== product.slug && !picked.includes(best)) picked.push(best);
    if (picked.length === limit) break;
  }
  return picked;
}

export function brandCounts(list: Product[]) {
  return brandsOf(list).map((name) => ({ name, count: list.filter((p) => p.brand === name).length }));
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
    const hay = normalize(`${p.name} ${brandLabel(p.brand)} ${p.sku ?? ""} ${p.mfrCode ?? ""}`);
    return terms.every((t) => hay.includes(t));
  });
}

// Disponíveis primeiro; a loja antiga mostrava esgotados misturados.
export function sortForDisplay(list: Product[]) {
  return [...list].sort((a, b) => Number(b.inStock) - Number(a.inStock));
}

const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, "pt-BR", { numeric: true });

export function sortProducts(list: Product[], sort: Sort) {
  const copy = [...list];
  if (sort === "az") return copy.sort(byName);
  if (sort === "za") return copy.sort((a, b) => byName(b, a));
  if (sort === "codigo") return copy.sort((a, b) => (a.sku ?? "").localeCompare(b.sku ?? "", "pt-BR", { numeric: true }));
  // Padrão: pronta entrega primeiro, depois na ordem das categorias (cabos, fibra, switches… antes de iluminação).
  return copy.sort((a, b) => Number(b.inStock) - Number(a.inStock) || catIndex(a) - catIndex(b) || byName(a, b));
}
const catIndex = (p: Product) => categories.findIndex((c) => c.slug === p.category);

export const PAGE_SIZE = 24;

// Página pedida na URL, limitada ao intervalo válido.
export function paginate<T>(list: T[], pageParam?: string) {
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1));
  const start = (page - 1) * PAGE_SIZE;
  return { page, pages, start, items: list.slice(start, start + PAGE_SIZE) };
}
