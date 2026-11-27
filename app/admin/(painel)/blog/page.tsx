import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Flash } from "@/app/admin/flash";
import { PageBody, PageHeader, panelCard, primaryButton } from "@/app/admin/ui";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/blog";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

async function PostList({ searchParams }: { searchParams: PageProps<"/admin/blog">["searchParams"] }) {
  const { supabase } = await requireAdmin();
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
      <PageBody>
        <Flash message={saved ? `“${saved}” foi salvo.` : removed ? `“${removed}” foi apagado.` : undefined} />
        <PageHeader
          title="Blog"
          description={`${data.filter((p) => p.published).length} publicados, ${data.filter((p) => !p.published).length} rascunhos`}
          action={
            <Link href="/admin/blog/novo" className={primaryButton}>
              <span className="icon text-xl!">add</span>
              Novo artigo
            </Link>
          }
        />

        <ul className={`${panelCard} divide-y divide-profundo/10 overflow-hidden`}>
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
                <span className="icon text-xl! text-marinho/30">chevron_right</span>
              </Link>
            </li>
          ))}
          {data.length === 0 && <li className="px-4 py-10 text-center text-marinho/60">Nenhum artigo ainda.</li>}
        </ul>
      </PageBody>
    </>
  );
}

export default function AdminBlogPage({ searchParams }: PageProps<"/admin/blog">) {
  return (
    <Suspense fallback={<PageLoader />}>
      <PostList searchParams={searchParams} />
    </Suspense>
  );
}
