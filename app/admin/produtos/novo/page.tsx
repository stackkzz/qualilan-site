import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminHeader } from "../../admin-header";
import { loadBrands } from "../load";
import { ProductForm } from "../product-form";

async function NewProduct() {
  const { user } = await requireAdmin();
  return (
    <>
      <AdminHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-profundo">Novo produto</h1>
        <ProductForm brands={await loadBrands()} />
      </main>
    </>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="h-14 bg-profundo" />}>
      <NewProduct />
    </Suspense>
  );
}
