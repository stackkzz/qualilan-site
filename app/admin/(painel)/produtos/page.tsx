import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Flash } from "@/app/admin/flash";
import { inputClass, PageBody, PageHeader, panelCard, primaryButton } from "@/app/admin/ui";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { getCategory, searchProducts, toProduct } from "@/lib/catalog";
import { categories } from "@/lib/site";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

async function ProductList({ searchParams }: { searchParams: PageProps<"/admin/produtos">["searchParams"] }) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const q = one(sp.q);
  const categoria = one(sp.categoria);
  const saved = one(sp.salvo);
  const removed = one(sp.removido);

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, sku, name, category, brand, image_url, in_stock, description, published")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);

  const published = new Map(data.map((r) => [r.id as string, r.published as boolean]));
  const list = searchProducts(data.map(toProduct), { q, categoria });

  return (
    <PageBody>
      <Flash message={saved ? `“${saved}” foi salvo. O site já mostra a alteração.` : removed ? `“${removed}” foi removido do catálogo.` : undefined} />
      <PageHeader
        title="Produtos"
        description={q || categoria ? `${list.length} de ${data.length} produtos` : `${data.length} produtos no catálogo`}
        action={
          <Link href="/admin/produtos/novo" className={primaryButton}>
            <span className="icon text-xl!">add</span>
            Novo produto
          </Link>
        }
      />

      <form role="search" className={`${panelCard} mb-4 flex flex-wrap items-center gap-2 p-2`}>
        <label htmlFor="admin-q" className="sr-only">
          Buscar produto
        </label>
        <div className="flex min-w-48 flex-1 items-center gap-2 px-2">
          <span className="icon text-xl! text-marinho/40">search</span>
          <input
            id="admin-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por nome, marca ou código"
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-marinho/40"
          />
        </div>
        <label htmlFor="admin-cat" className="sr-only">
          Categoria
        </label>
        <select id="admin-cat" name="categoria" defaultValue={categoria ?? ""} className={`${inputClass} w-auto py-2 text-sm`}>
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg border border-profundo/15 px-4 py-2 text-sm font-semibold text-profundo hover:border-profundo">
          Filtrar
        </button>
        {(q || categoria) && (
          <Link href="/admin/produtos" className="px-2 text-sm text-marinho/60 hover:text-profundo">
            Limpar
          </Link>
        )}
      </form>

      <ul className={`${panelCard} divide-y divide-profundo/10 overflow-hidden`}>
        {list.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/produtos/${p.id}`} className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-offwhite/70">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-offwhite">
                {p.image && <Image src={p.image} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-profundo">{p.name}</p>
                <p className="mt-0.5 truncate text-xs text-marinho/50">
                  {getCategory(p.category)?.name}
                  {p.brand && ` · ${p.brand}`}
                  {p.sku && ` · cód. ${p.sku}`}
                </p>
              </div>
              <div className="hidden shrink-0 gap-1.5 sm:flex">
                {!published.get(p.id) && <span className="rounded-md bg-offwhite px-2 py-0.5 text-xs text-marinho/70">Oculto</span>}
                {!p.inStock && <span className="rounded-md bg-amarelo/30 px-2 py-0.5 text-xs text-profundo">Sob consulta</span>}
              </div>
              <span className="icon text-xl! text-marinho/30 transition-colors group-hover:text-royal">chevron_right</span>
            </Link>
          </li>
        ))}
        {list.length === 0 && (
          <li className="px-4 py-12 text-center text-sm text-marinho/60">
            Nenhum produto encontrado.{" "}
            <Link href="/admin/produtos" className="font-semibold text-royal hover:underline">
              Ver todos
            </Link>
          </li>
        )}
      </ul>
    </PageBody>
  );
}

export default function AdminProductsPage({ searchParams }: PageProps<"/admin/produtos">) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductList searchParams={searchParams} />
    </Suspense>
  );
}
