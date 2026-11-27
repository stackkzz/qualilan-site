import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { AdminHeader } from "../../admin-header";
import { loadBrands } from "../load";
import { ProductForm, type EditableProduct } from "../product-form";

async function EditProduct({ params }: { params: PageProps<"/admin/produtos/[id]">["params"] }) {
  const { supabase, user } = await requireAdmin();
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
      <AdminHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-profundo">Editar produto</h1>
        <ProductForm product={data as EditableProduct} brands={await loadBrands()} />
      </main>
    </>
  );
}

export default function EditProductPage({ params }: PageProps<"/admin/produtos/[id]">) {
  return (
    <Suspense fallback={
        <>
          <div className="h-14 bg-profundo" />
          <PageLoader />
        </>
      }>
      <EditProduct params={params} />
    </Suspense>
  );
}
