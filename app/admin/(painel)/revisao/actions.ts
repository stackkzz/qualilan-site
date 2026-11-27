"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { PRODUCTS_TAG } from "@/lib/catalog";

// Salva o nome revisado (ou só confirma o atual) e marca o produto como revisado.
export async function reviewName(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 300);
  if (!/^[0-9a-f-]{36}$/i.test(id) || name.length < 2) return;
  await supabase.from("products").update({ name, name_reviewed: true }).eq("id", id);
  updateTag(PRODUCTS_TAG);
  revalidatePath("/admin/revisao");
}
