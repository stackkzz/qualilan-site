import Link from "next/link";
import type { ReactNode } from "react";
import { brandLabel, listedCategories } from "@/lib/catalog";

export async function CategoryNav({ active }: { active?: string }) {
  const list = await listedCategories();
  return (
    <nav aria-label="Categorias">
      <h2 className="mb-3 text-sm font-semibold text-profundo">Categorias</h2>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-2 [mask-image:linear-gradient(to_right,black_85%,transparent)] lg:flex-col lg:gap-0.5 lg:overflow-visible lg:[mask-image:none]">
        {list.map((c) => {
          const count = c.count;
          const isActive = c.slug === active;
          return (
            <li key={c.slug} className="shrink-0">
              <Link
                href={`/catalogo/${c.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-full px-4 py-2 text-sm transition-colors lg:rounded-lg lg:px-3 ${
                  isActive
                    ? "bg-profundo text-white"
                    : "border border-profundo/10 text-marinho hover:bg-white lg:border-transparent"
                }`}
              >
                <span className={`icon text-xl! ${isActive ? "icon-fill text-amarelo" : "icon-hover-fill text-royal"}`}>{c.icon}</span>
                <span className="whitespace-nowrap lg:flex-1">{c.name}</span>
                <span className={`hidden text-xs tabular-nums lg:inline ${isActive ? "text-white/60" : "text-marinho/40"}`}>
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

// Filtro de marcas na barra lateral (antes eram vários botões soltos acima da grade).
export function BrandFilter({
  brands,
  active,
  hrefFor,
}: {
  brands: { name: string; count: number }[];
  active?: string;
  hrefFor: (brand?: string) => string;
}) {
  if (brands.length < 2) return null;
  const items = [{ name: undefined as string | undefined, count: brands.reduce((n, b) => n + b.count, 0) }, ...brands];
  return (
    <nav aria-label="Filtrar por marca" className="mt-8 hidden lg:block">
      <h2 className="mb-3 text-sm font-semibold text-profundo">Marcas</h2>
      <ul className="space-y-0.5">
        {items.map((b) => {
          const isActive = b.name === active;
          return (
            <li key={b.name ?? "todas"}>
              <Link
                href={hrefFor(b.name)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  isActive ? "bg-royal/10 font-semibold text-royal" : "text-marinho/75 hover:bg-white hover:text-profundo"
                }`}
              >
                {b.name ? brandLabel(b.name) : "Todas as marcas"}
                <span className="text-xs tabular-nums text-marinho/40">{b.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Faixa do topo das páginas de catálogo: trilha, título, contagem e busca larga.
export function CatalogHeader({
  title,
  count,
  crumb,
  search,
  children,
}: {
  title: string;
  count: number;
  crumb?: { label: string; href: string };
  search: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-profundo/10 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">
        <nav aria-label="Você está em" className="text-sm text-marinho/55">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/catalogo" className="hover:text-royal">
                Catálogo
              </Link>
            </li>
            {crumb && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link href={crumb.href} className="hover:text-royal">
                    {crumb.label}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem]">{title}</h1>
            <p className="mt-1 text-marinho/60">
              {count} {count === 1 ? "produto" : "produtos"}
            </p>
          </div>
          <div className="w-full lg:max-w-lg">{search}</div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function CatalogSearch({ defaultValue, categoria }: { defaultValue?: string; categoria?: string }) {
  return (
    <form id="busca" action="/catalogo" role="search" className="w-full scroll-mt-24">
      <label htmlFor="catalog-q" className="sr-only">
        Buscar no catálogo
      </label>
      {categoria && <input type="hidden" name="categoria" value={categoria} />}
      <div className="flex items-center rounded-xl border border-profundo/15 bg-offwhite p-1 pl-4 transition-[border-color,background-color,box-shadow] focus-within:border-royal focus-within:bg-white focus-within:ring-4 focus-within:ring-royal/15">
        <span className="icon text-marinho/40">search</span>
        <input
          id="catalog-q"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Nome, marca ou código"
          className="min-w-0 flex-1 bg-transparent px-2.5 py-3 outline-none placeholder:text-marinho/45 sm:px-3"
        />
        {/* No celular o botão vira só a seta, para o texto de exemplo caber inteiro */}
        <button
          type="submit"
          aria-label="Buscar"
          className="grid place-items-center rounded-lg bg-profundo px-3.5 py-3 text-sm font-semibold text-white hover:bg-royal sm:px-5"
        >
          <span className="icon text-xl! sm:hidden">arrow_forward</span>
          <span className="hidden sm:inline">Buscar</span>
        </button>
      </div>
    </form>
  );
}
