import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { categories } from "@/lib/site";

export async function CategoryNav({ active }: { active?: string }) {
  const products = await getProducts();
  return (
    <nav aria-label="Categorias">
      <h2 className="mb-3 text-sm font-semibold text-marinho/60">Categorias</h2>
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible">
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          const isActive = c.slug === active;
          return (
            <li key={c.slug} className="shrink-0">
              <Link
                href={`/catalogo/${c.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm transition-colors lg:rounded-lg lg:px-3 ${
                  isActive
                    ? "bg-profundo text-white"
                    : "border border-profundo/10 text-marinho hover:bg-white lg:border-transparent"
                }`}
              >
                <span className={`icon text-xl! ${isActive ? "text-amarelo" : "text-royal"}`}>{c.icon}</span>
                <span className="whitespace-nowrap lg:flex-1">{c.name}</span>
                <span className={`hidden text-xs lg:inline ${isActive ? "text-white/60" : "text-marinho/40"}`}>
                  {count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function CatalogSearch({ defaultValue, categoria }: { defaultValue?: string; categoria?: string }) {
  return (
    <form action="/catalogo" role="search" className="w-full max-w-xl">
      <label htmlFor="catalog-q" className="sr-only">
        Buscar no catálogo
      </label>
      {categoria && <input type="hidden" name="categoria" value={categoria} />}
      <div className="flex items-center rounded-full border border-profundo/15 bg-white p-1 pl-4 focus-within:border-royal">
        <span className="icon text-royal">search</span>
        <input
          id="catalog-q"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Produto, marca ou código"
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none placeholder:text-marinho/45"
        />
        <button type="submit" className="rounded-full bg-royal px-5 py-2.5 text-sm font-semibold text-white hover:bg-profundo">
          Buscar
        </button>
      </div>
    </form>
  );
}
