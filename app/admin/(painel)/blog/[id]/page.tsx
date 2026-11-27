import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageBody, PageHeader } from "@/app/admin/ui";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { loadPostCategories } from "../load";
import { PostForm, type EditablePost } from "../post-form";

async function EditPost({ params }: { params: PageProps<"/admin/blog/[id]">["params"] }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, category, cover_url, body, published, published_at")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <>
      <PageBody>
        <Link href="/admin/blog" className="mb-3 inline-flex items-center gap-1 text-sm text-marinho/60 hover:text-profundo">
          <span className="icon text-lg!">arrow_back</span>
          Blog
        </Link>
        <PageHeader title="Editar artigo" />
        <PostForm post={data as EditablePost} categories={await loadPostCategories()} />
      </PageBody>
    </>
  );
}

export default function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  return (
    <Suspense fallback={<PageLoader />}>
      <EditPost params={params} />
    </Suspense>
  );
}
