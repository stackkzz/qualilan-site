import Link from "next/link";
import { Suspense } from "react";
import { PageBody, PageHeader } from "@/app/admin/ui";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { loadPostCategories } from "../load";
import { PostForm } from "../post-form";

async function NewPost() {
  await requireAdmin();
  return (
    <>
      <PageBody>
        <Link href="/admin/blog" className="mb-3 inline-flex items-center gap-1 text-sm text-marinho/60 hover:text-profundo">
          <span className="icon text-lg!">arrow_back</span>
          Blog
        </Link>
        <PageHeader title="Novo artigo" />
        <PostForm categories={await loadPostCategories()} />
      </PageBody>
    </>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <NewPost />
    </Suspense>
  );
}
