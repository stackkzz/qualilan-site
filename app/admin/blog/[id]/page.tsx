import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { AdminHeader } from "../../admin-header";
import { loadPostCategories } from "../load";
import { PostForm, type EditablePost } from "../post-form";

async function EditPost({ params }: { params: PageProps<"/admin/blog/[id]">["params"] }) {
  const { supabase, user } = await requireAdmin();
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
      <AdminHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-profundo">Editar artigo</h1>
        <PostForm post={data as EditablePost} categories={await loadPostCategories()} />
      </main>
    </>
  );
}

export default function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  return (
    <Suspense fallback={
        <>
          <div className="h-14 bg-profundo" />
          <PageLoader />
        </>
      }>
      <EditPost params={params} />
    </Suspense>
  );
}
