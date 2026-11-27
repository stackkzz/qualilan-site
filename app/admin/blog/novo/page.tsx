import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { AdminHeader } from "../../admin-header";
import { loadPostCategories } from "../load";
import { PostForm } from "../post-form";

async function NewPost() {
  const { user } = await requireAdmin();
  return (
    <>
      <AdminHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-profundo">Novo artigo</h1>
        <PostForm categories={await loadPostCategories()} />
      </main>
    </>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={
        <>
          <div className="h-14 bg-profundo" />
          <PageLoader />
        </>
      }>
      <NewPost />
    </Suspense>
  );
}
