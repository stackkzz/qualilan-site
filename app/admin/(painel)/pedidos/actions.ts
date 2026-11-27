"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

const STATUSES = ["novo", "respondido", "arquivado"] as const;

export async function setRequestStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !STATUSES.includes(status as (typeof STATUSES)[number])) return;
  await supabase.from("quote_requests").update({ status }).eq("id", id);
  revalidatePath("/admin/pedidos");
}
