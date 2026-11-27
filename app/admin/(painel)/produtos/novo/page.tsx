import Link from "next/link";
import { Suspense } from "react";
import { PageBody, PageHeader } from "@/app/admin/ui";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { loadBrands } from "../load";
import { ProductForm } from "../product-form";

async function NewProduct() {
  await requireAdmin();
  return (
    <>
      <PageBody>
        <Link href="/admin/produtos" className="mb-3 inline-flex items-center gap-1 text-sm text-marinho/60 hover:text-profundo">
          <span className="icon text-lg!">arrow_back</span>
          Produtos
        </Link>
        <PageHeader title="Novo produto" />
        <ProductForm brands={await loadBrands()} />
      </PageBody>
    </>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <NewProduct />
    </Suspense>
  );
}
