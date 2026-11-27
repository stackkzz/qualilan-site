import { requireAdmin } from "@/lib/admin";

export async function loadPostCategories() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("posts").select("category");
  return [...new Set((data ?? []).map((r) => r.category as string))].sort();
}
