import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageBody, PageHeader } from "@/app/admin/ui";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { loadBrands } from "../load";
import { ProductForm, type EditableProduct } from "../product-form";

async function EditProduct({ params }: { params: PageProps<"/admin/produtos/[id]">["params"] }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, sku, brand, category, description, image_url, in_stock, published, mfr_code, unit, subcategory")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <>
      <PageBody>
        <Link href="/admin/produtos" className="mb-3 inline-flex items-center gap-1 text-sm text-marinho/60 hover:text-profundo">
          <span className="icon text-lg!">arrow_back</span>
          Produtos
        </Link>
        <PageHeader title="Editar produto" />
        <ProductForm product={data as EditableProduct} brands={await loadBrands()} />
      </PageBody>
    </>
  );
}

export default function EditProductPage({ params }: PageProps<"/admin/produtos/[id]">) {
  return (
    <Suspense fallback={<PageLoader />}>
      <EditProduct params={params} />
    </Suspense>
  );
}
