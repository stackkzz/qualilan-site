import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { getCategory } from "@/lib/catalog";
import { AdminHeader } from "../admin-header";
import { inputClass } from "../ui";
import { reviewName } from "./actions";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

// Revisão dos nomes gerados a partir da loja antiga: nome original ao lado, edita ou confirma, e o item sai da fila.
async function Review({ searchParams }: { searchParams: PageProps<"/admin/revisao">["searchParams"] }) {
  const { supabase, user } = await requireAdmin();
  const all = one((await searchParams).ver) === "todos";
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, source_name, category, image_url, name_reviewed")
    .order("category")
    .order("name");
  if (error) throw new Error(error.message);
  const done = data.filter((p) => p.name_reviewed).length;
  const list = all ? data : data.filter((p) => !p.name_reviewed);

  return (
    <>
      <AdminHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-profundo">Revisão de nomes</h1>
            <p className="mt-1 max-w-2xl text-marinho/60">
              Os nomes foram padronizados automaticamente a partir da loja antiga. Corrija o que precisar e salve, ou só
              confirme. Cada produto revisado sai da fila.
            </p>
          </div>
          <Link href={all ? "/admin/revisao" : "/admin/revisao?ver=todos"} className="text-sm font-semibold text-royal hover:underline">
            {all ? "Ver só os pendentes" : "Ver todos"}
          </Link>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5">
          <p className="text-sm font-medium text-profundo">
            {done} de {data.length} revisados
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-offwhite" role="progressbar" aria-valuenow={done} aria-valuemax={data.length}>
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${(done / Math.max(1, data.length)) * 100}%` }} />
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {list.map((p) => (
            <li key={p.id} className="rounded-2xl bg-white p-4">
              <form action={reviewName} className="flex flex-col gap-3 md:flex-row md:items-center">
                <input type="hidden" name="id" value={p.id} />
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-offwhite">
                  {p.image_url && <Image src={p.image_url} alt="" fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="truncate text-xs text-marinho/50" title={p.source_name ?? ""}>
                    {getCategory(p.category)?.name} · Original: {p.source_name ?? "—"}
                  </p>
                  <label className="sr-only" htmlFor={`n-${p.id}`}>
                    Nome de exibição
                  </label>
                  <input id={`n-${p.id}`} name="name" defaultValue={p.name} required minLength={2} maxLength={300} className={inputClass} />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {p.name_reviewed && <span className="icon text-emerald-600" title="Revisado">check_circle</span>}
                  <Link href={`/produto/${p.slug}`} target="_blank" className="px-2 text-sm text-royal hover:underline">
                    Ver
                  </Link>
                  <button type="submit" className="rounded-full bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-profundo">
                    {p.name_reviewed ? "Salvar" : "Confirmar"}
                  </button>
                </div>
              </form>
            </li>
          ))}
          {list.length === 0 && (
            <li className="rounded-2xl bg-white px-6 py-10 text-center text-marinho/60">Todos os nomes foram revisados.</li>
          )}
        </ul>
      </main>
    </>
  );
}

export default function AdminReviewPage({ searchParams }: PageProps<"/admin/revisao">) {
  return (
    <Suspense
      fallback={
        <>
          <div className="h-14 bg-profundo" />
          <PageLoader />
        </>
      }
    >
      <Review searchParams={searchParams} />
    </Suspense>
  );
}
