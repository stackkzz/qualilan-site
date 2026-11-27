import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { AddToQuote } from "./quote-cart";

// Variação que muda entre peças da mesma família (metragem e cor): fica numa etiqueta, já que o nome é cortado no card.
const COLORS: Record<string, string> = {
  azul: "#2563eb", amarelo: "#facc15", vermelho: "#dc2626", verde: "#16a34a", preto: "#111827", branco: "#f8fafc",
  cinza: "#9ca3af", laranja: "#f97316", roxo: "#7c3aed", violeta: "#7c3aed", bege: "#d6c7a1", marrom: "#92400e",
};
export function variantOf(name: string) {
  const length = name.match(/\b(\d+(?:,\d+)?) ?m\b/)?.[1];
  const color = name.toLowerCase().split(/[\s,]+/).find((w) => Object.hasOwn(COLORS, w));
  return { length: length ? `${length} m` : null, color: color ?? null };
}

export function ProductCard({ product }: { product: Product }) {
  const v = /^(patch cord|cabo)/i.test(product.name) ? variantOf(product.name) : { length: null, color: null };
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-profundo/10 bg-white">
      <Link href={`/produto/${product.slug}`} className="group flex flex-1 flex-col p-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-offwhite">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-3 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {!product.inStock && (
            <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-marinho/70">
              Sob consulta
            </span>
          )}
        </div>
        <p className="mt-4 flex items-center justify-between gap-2 text-xs">
          {product.brand && <span className="font-semibold text-royal">{product.brand}</span>}
          {product.inStock && (
            <span className="ml-auto flex items-center gap-1 text-emerald-700">
              <span className="icon text-sm!">check</span>
              Em estoque
            </span>
          )}
        </p>
        {(v.length || v.color) && (
          <p className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold text-profundo">
            {v.length && <span className="rounded bg-offwhite px-2 py-0.5 tabular-nums">{v.length}</span>}
            {v.color && (
              <span className="inline-flex items-center gap-1.5 rounded bg-offwhite px-2 py-0.5">
                <span aria-hidden className="size-2.5 rounded-full ring-1 ring-profundo/20" style={{ background: COLORS[v.color] }} />
                {v.color}
              </span>
            )}
          </p>
        )}
        <h3 className="mt-1.5 line-clamp-3 text-[15px] font-medium leading-snug text-marinho/85 group-hover:text-royal">
          {product.name}
        </h3>
      </Link>
      <div className="px-4 pb-4">
        <AddToQuote product={{ slug: product.slug, name: product.name, sku: product.sku, image: product.image, unit: product.unit }} size="sm" />
      </div>
    </li>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  // Cards separados (antes era fundo cinza com 1 px de vão: sobrava cinza nos espaços vazios da última linha).
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </ul>
  );
}
