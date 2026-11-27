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

// "Compre junto" por regra técnica: para cada tipo de produto, o que de fato entra no mesmo projeto.
// Câmera IP pede switch PoE e cabo de rede (nunca DVR); câmera analógica pede DVR, coaxial e BNC.
// Produto sem regra não mostra a seção: sugestão errada derruba a confiança de quem é técnico.
// Os nomes são comparados sem acento e em minúsculas.
const CAT6_CABLE = /^cabo (de dados )?.*cat\.?6/;
const CAT5_CABLE = /^cabo (de dados )?.*cat\.?5/;
const POE_SWITCH = /^switch .*poe/;
const AP = /^access point/;
const ANALOG_CAM = /^camera (bullet|dome) .*full hd/;
const RULES: [RegExp, RegExp[]][] = [
  [/^camera (ip|speed dome)/, [POE_SWITCH, /nvr/, CAT6_CABLE, /^injetor poe/]],
  [/^kit cftv/, [/^hd .*sata/, /^cabo coaxial/, /^conector bnc/, /^fonte/]],
  [ANALOG_CAM, [/dvr/, /^cabo coaxial/, /^conector bnc/, /^fonte/]],
  [/dvr/, [ANALOG_CAM, /^hd .*sata/, /^cabo coaxial/, /^fonte/]],
  [/^(cabo coaxial|conector bnc|fonte|plug p4)/, [/dvr/, ANALOG_CAM, /^cabo coaxial/, /^conector bnc/, /^fonte/]],
  [/^hd .*sata/, [/dvr/, ANALOG_CAM]],
  [/^injetor poe/, [AP, CAT6_CABLE, /^patch cord .*cat\.?6/]],
  [/^(access point|radio)/, [/^injetor poe/, POE_SWITCH, CAT6_CABLE, /^patch cord .*cat\.?6/]],
  [/^(roteador|gateway)/, [/^switch .*gerenciavel|^switch .*(gigabit|sfp)/, AP, /^patch cord .*cat\.?6/]],
  [/^cloud key/, [AP, POE_SWITCH]],
  [POE_SWITCH, [AP, /^camera ip/, /^patch cord .*cat\.?6/, CAT6_CABLE]],
  [/^switch/, [/^patch cord .*cat\.?6/, /^patch panel .*cat\.?6/, CAT6_CABLE, /^guia de cabos/]],
  [CAT6_CABLE, [/^patch panel .*cat\.?6/, /^patch cord .*cat\.?6/, /^ferramenta de crimp/, /^rotulador/]],
  [CAT5_CABLE, [/^patch panel .*cat\.?5/, /^patch cord .*cat\.?5/, /^ferramenta de crimp/, /^rotulador/]],
  [/^patch cord .*cat\.?6/, [/^patch panel .*cat\.?6/, CAT6_CABLE, /^switch .*gigabit/, /^guia de cabos/]],
  [/^patch cord .*cat\.?5/, [/^patch panel .*cat\.?5/, CAT5_CABLE, /^switch/, /^guia de cabos/]],
  [/^patch panel .*cat\.?6/, [/^patch cord .*cat\.?6/, CAT6_CABLE, /^guia de cabos/, /^ferramenta/]],
  [/^patch panel/, [/^patch cord .*cat\.?5/, CAT5_CABLE, /^guia de cabos/, /^ferramenta/]],
  [/^guia de cabos/, [/^patch panel/, /^patch cord .*cat\.?6/]],
  [/^ferramenta (de crimp|de insercao|de impacto)/, [CAT6_CABLE, /^patch panel/, /^rotulador/]],
  [/^(dio|kit 3 placas lgx|kit bandeja|kit de ancoragem)/, [/^kit bandeja de emenda/, /^kit 3 placas lgx/, /^kit de ancoragem/, /^ferramenta de limpeza optica/]],
  [/^maquina de fusao/, [/^kit bandeja de emenda/, /^ferramenta de limpeza optica/, /^dio/]],
  [/^ferramenta de limpeza optica/, [/^dio/, /^kit 3 placas lgx/, /^maquina de fusao/]],
  [/^modulo sfp/, [/^switch .*sfp/, /^chassi .*conversor/, /^dio/]],
  [/^chassi .*conversor/, [/^modulo sfp/, /^dio/]],
  [/^(controlador de acesso|leitor)/, [/^chaveiro/, /^fonte/, CAT6_CABLE]],
  [/^chaveiro/, [/^controlador de acesso/]],
  [/^rotulador/, [/^fita .*rotulador/]],
  [/^fita .*rotulador/, [/^rotulador/]],
];

export function complementsFor(product: Product, all: Product[], limit = 4) {
  const name = normalize(product.name);
  const rule = RULES.find(([match]) => match.test(name));
  if (!rule) return [];
  const score = (p: Product) => (p.brand && p.brand === product.brand ? 2 : 0) + (p.inStock ? 1 : 0);
  const picked: Product[] = [];
  for (const want of rule[1]) {
    const best = all
      .filter((p) => p.slug !== product.slug && !picked.includes(p) && want.test(normalize(p.name)))
      .sort((a, b) => score(b) - score(a) || byName(a, b))[0];
    if (best) picked.push(best);
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
