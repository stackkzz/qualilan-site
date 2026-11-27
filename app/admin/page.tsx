import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { getCategory, searchProducts, toProduct } from "@/lib/catalog";
import { categories } from "@/lib/site";
import { AdminHeader } from "./admin-header";
import { inputClass } from "./ui";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

async function ProductList({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const { supabase, user } = await requireAdmin();
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
    <>
      <AdminHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        {(saved || removed) && (
          <p role="status" className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {saved ? `“${saved}” foi salvo. O site já mostra a alteração.` : `“${removed}” foi removido do catálogo.`}
          </p>
        )}

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-profundo">Produtos</h1>
            <p className="mt-1 text-marinho/60">
              {list.length} de {data.length} produtos
            </p>
          </div>
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center gap-2 rounded-full bg-laranja px-5 py-2.5 font-semibold text-profundo hover:bg-amarelo"
          >
            <span className="icon text-xl!">add</span>
            Novo produto
          </Link>
        </div>

        <form className="mb-6 flex flex-wrap gap-3" role="search">
          <label htmlFor="admin-q" className="sr-only">
            Buscar produto
          </label>
          <input
            id="admin-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por nome, marca ou código"
            className={`${inputClass} max-w-sm flex-1`}
          />
          <label htmlFor="admin-cat" className="sr-only">
            Categoria
          </label>
          <select id="admin-cat" name="categoria" defaultValue={categoria ?? ""} className={`${inputClass} w-auto`}>
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-full bg-royal px-5 py-2.5 text-sm font-semibold text-white hover:bg-profundo">
            Filtrar
          </button>
        </form>

        <ul className="divide-y divide-profundo/10 overflow-hidden rounded-2xl bg-white">
          {list.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/produtos/${p.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-offwhite">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-offwhite">
                  {p.image && <Image src={p.image} alt="" fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="mt-0.5 text-xs text-marinho/50">
                    {getCategory(p.category)?.name}
                    {p.brand && `, ${p.brand}`}
                    {p.sku && `, cód. ${p.sku}`}
                  </p>
                </div>
                {!published.get(p.id) && (
                  <span className="flex items-center gap-1 rounded-full bg-offwhite px-2.5 py-1 text-xs text-marinho/70">
                    <span className="icon text-base!">visibility_off</span>
                    Oculto
                  </span>
                )}
                {!p.inStock && <span className="rounded-full bg-amarelo/30 px-2.5 py-1 text-xs">Sob consulta</span>}
                <span className="icon text-royal">edit</span>
              </Link>
            </li>
          ))}
          {list.length === 0 && <li className="px-4 py-10 text-center text-marinho/60">Nenhum produto encontrado.</li>}
        </ul>
      </main>
    </>
  );
}

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<div className="h-14 bg-profundo" />}>
      <ProductList searchParams={searchParams} />
    </Suspense>
  );
}
