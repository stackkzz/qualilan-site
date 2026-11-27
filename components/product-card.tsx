import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { AddToQuote } from "./quote-cart";

export function ProductCard({ product }: { product: Product }) {
  return (
    <li className="flex flex-col bg-white">
      <Link href={`/produto/${product.slug}`} className="group flex flex-1 flex-col p-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-offwhite">
          {product.image && (
            <Image
              src={product.image}
              alt=""
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
        {product.brand && <p className="mt-4 text-xs font-semibold text-royal">{product.brand}</p>}
        <h3 className="mt-1 line-clamp-3 text-[13px] leading-[1.45] text-marinho/80 group-hover:text-royal">
          {product.name}
        </h3>
      </Link>
      <div className="px-4 pb-4">
        <AddToQuote product={{ slug: product.slug, name: product.name, sku: product.sku, image: product.image }} size="sm" />
      </div>
    </li>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-profundo/10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </ul>
  );
}
