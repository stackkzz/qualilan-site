import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/blog";
import { AdminHeader } from "../admin-header";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

async function PostList({ searchParams }: { searchParams: PageProps<"/admin/blog">["searchParams"] }) {
  const { supabase, user } = await requireAdmin();
  const sp = await searchParams;
  const saved = one(sp.salvo);
  const removed = one(sp.removido);

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, category, cover_url, published, published_at")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <>
      <AdminHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        {(saved || removed) && (
          <p role="status" className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {saved ? `“${saved}” foi salvo.` : `“${removed}” foi apagado.`}
          </p>
        )}

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-profundo">Blog</h1>
            <p className="mt-1 text-marinho/60">
              {data.filter((p) => p.published).length} publicados, {data.filter((p) => !p.published).length} rascunhos
            </p>
          </div>
          <Link
            href="/admin/blog/novo"
            className="inline-flex items-center gap-2 rounded-full bg-laranja px-5 py-2.5 font-semibold text-profundo hover:bg-amarelo"
          >
            <span className="icon text-xl!">add</span>
            Novo artigo
          </Link>
        </div>

        <ul className="divide-y divide-profundo/10 overflow-hidden rounded-2xl bg-white">
          {data.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/blog/${p.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-offwhite">
                <div className="relative aspect-[16/9] w-24 shrink-0 overflow-hidden rounded-lg bg-offwhite">
                  {p.cover_url && <Image src={p.cover_url} alt="" fill sizes="96px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="mt-0.5 text-xs text-marinho/50">
                    {p.category}, {formatDate(p.published_at)}
                  </p>
                </div>
                {!p.published && <span className="rounded-full bg-amarelo/30 px-2.5 py-1 text-xs">Rascunho</span>}
                <span className="icon text-royal">edit</span>
              </Link>
            </li>
          ))}
          {data.length === 0 && <li className="px-4 py-10 text-center text-marinho/60">Nenhum artigo ainda.</li>}
        </ul>
      </main>
    </>
  );
}

export default function AdminBlogPage({ searchParams }: PageProps<"/admin/blog">) {
  return (
    <Suspense fallback={
        <>
          <div className="h-14 bg-profundo" />
          <PageLoader />
        </>
      }>
      <PostList searchParams={searchParams} />
    </Suspense>
  );
}
