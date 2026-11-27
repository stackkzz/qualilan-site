import Link from "next/link";
import type { ReactNode } from "react";
import { PAGE_SIZE, paginate, SORTS, sortProducts, type Product, type Sort } from "@/lib/catalog";
import { ProductGrid } from "./product-card";
import { SortSelect } from "./sort-select";

type Params = Record<string, string | undefined>;

// Monta a URL mantendo os filtros atuais; página 1 e ordem padrão ficam fora da URL.
function buildHref(base: string, params: Params, change: Params) {
  const merged = { ...params, ...change };
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (!v || (k === "pagina" && v === "1") || (k === "ordem" && v === "disponiveis")) continue;
    sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

// Números de página com reticências: 1 … 4 5 6 … 12
function pageNumbers(page: number, pages: number) {
  const set = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export function ProductListing({
  products,
  base,
  params,
  sort,
  page: pageParam,
  empty,
}: {
  products: Product[];
  base: string;
  params: Params;
  sort: Sort;
  page?: string;
  empty: ReactNode;
}) {
  const sorted = sortProducts(products, sort);
  const { page, pages, start, items } = paginate(sorted, pageParam);
  const href = (change: Params) => buildHref(base, { ...params, ordem: sort, pagina: String(page) }, change);
  const sortHrefs = Object.fromEntries(SORTS.map((s) => [s.value, href({ ordem: s.value, pagina: "1" })])) as Record<Sort, string>;

  if (!products.length) return <>{empty}</>;

  const navBtn = "grid h-10 min-w-10 place-items-center rounded-lg px-3 text-sm font-medium transition-colors";

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-marinho/60">
          Mostrando{" "}
          <span className="font-semibold text-profundo">
            {start + 1}–{start + items.length}
          </span>{" "}
          de {sorted.length}
        </p>
        <SortSelect value={sort} hrefFor={sortHrefs} />
      </div>

      <ProductGrid products={items} />

      {pages > 1 && (
        <nav aria-label="Páginas" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
          {page > 1 ? (
            <Link href={href({ pagina: String(page - 1) })} className={`${navBtn} border border-profundo/15 bg-white hover:border-royal`} aria-label="Página anterior">
              <span className="icon text-xl!">chevron_left</span>
            </Link>
          ) : (
            <span className={`${navBtn} border border-profundo/10 text-marinho/25`} aria-hidden>
              <span className="icon text-xl!">chevron_left</span>
            </span>
          )}
          {pageNumbers(page, pages).map((n, i) =>
            n === "…" ? (
              <span key={`gap-${i}`} className="px-1 text-marinho/40">
                …
              </span>
            ) : (
              <Link
                key={n}
                href={href({ pagina: String(n) })}
                aria-current={n === page ? "page" : undefined}
                className={`${navBtn} ${n === page ? "bg-profundo text-white" : "border border-profundo/15 bg-white text-profundo hover:border-royal"}`}
              >
                {n}
              </Link>
            ),
          )}
          {page < pages ? (
            <Link href={href({ pagina: String(page + 1) })} className={`${navBtn} border border-profundo/15 bg-white hover:border-royal`} aria-label="Próxima página">
              <span className="icon text-xl!">chevron_right</span>
            </Link>
          ) : (
            <span className={`${navBtn} border border-profundo/10 text-marinho/25`} aria-hidden>
              <span className="icon text-xl!">chevron_right</span>
            </span>
          )}
        </nav>
      )}
      {pages > 1 && (
        <p className="mt-3 text-center text-xs text-marinho/65">
          Página {page} de {pages}, {PAGE_SIZE} produtos por página
        </p>
      )}
    </>
  );
}
