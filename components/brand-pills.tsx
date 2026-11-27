import Link from "next/link";

// Versão do filtro de marcas para celular: uma linha que rola na horizontal.
export function BrandPills({ brands, active, hrefFor }: { brands: string[]; active?: string; hrefFor: (b?: string) => string }) {
  if (brands.length < 2) return null;
  return (
    <ul className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1 text-sm [mask-image:linear-gradient(to_right,black_85%,transparent)] lg:hidden" aria-label="Filtrar por marca">
      {[undefined, ...brands].map((b) => {
        const isActive = b === active;
        return (
          <li key={b ?? "todas"} className="shrink-0">
            <Link
              href={hrefFor(b)}
              aria-current={isActive ? "true" : undefined}
              className={`inline-block rounded-full px-4 py-1.5 ${isActive ? "bg-royal text-white" : "border border-profundo/15 bg-white"}`}
            >
              {b ? (b.toLowerCase() === "lightera" ? `${b} (antiga Furukawa)` : b) : "Todas"}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
