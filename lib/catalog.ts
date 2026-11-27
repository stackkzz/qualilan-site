// shortcut: catálogo lido de data/products.json (importado da loja antiga); trocar pelo CMS quando o painel existir.
import raw from "@/data/products.json";
import { categories } from "./site";

export type Product = {
  slug: string;
  sku: string | null;
  name: string;
  category: string;
  brand: string | null;
  image: string | null;
  inStock: boolean;
  description: string;
};

export const products = raw as Product[];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function brandsOf(list: Product[]) {
  return [...new Set(list.map((p) => p.brand).filter((b): b is string => !!b))].sort();
}

// Marcas vêm em caixa alta da loja antiga; exibimos no formato oficial de cada uma.
const BRAND_LABELS: Record<string, string> = {
  "TP-LINK": "TP-Link",
  "CONTROL ID": "Control iD",
  "O-TECH": "O-Tech",
  ALM: "ALM",
  SIL: "SIL",
};
export function brandLabel(brand: string) {
  return BRAND_LABELS[brand] ?? brand.charAt(0) + brand.slice(1).toLowerCase();
}

const normalize =(s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Busca simples: todas as palavras precisam aparecer em nome, marca ou código.
export function searchProducts({ q, categoria, marca }: { q?: string; categoria?: string; marca?: string }) {
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
