import { requireAdmin } from "@/lib/admin";

export async function loadBrands() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("brand").not("brand", "is", null);
  return [...new Set((data ?? []).map((r) => r.brand as string))].sort();
}
