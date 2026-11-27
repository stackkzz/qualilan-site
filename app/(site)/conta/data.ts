import type { User } from "@supabase/supabase-js";
import type { createSupabaseServerClient } from "@/lib/supabase/server";
import { emptyProfile, type ProfileValues } from "./profile";

const cols = "person_type, name, last_name, company, cpf, cnpj, rg_ie, phone, cep, street, number, complement, district, city, state, newsletter";
type Supabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

// Perfil do cliente logado. Conta confirmada por e-mail: o cadastro veio guardado no usuário e vira perfil no 1º acesso.
export async function loadProfile(supabase: Supabase, user: User): Promise<ProfileValues | null> {
  let { data: p } = await supabase.from("customers").select(cols).eq("user_id", user.id).maybeSingle();
  const pending = user.user_metadata?.profile;
  if (!p && pending && typeof pending === "object") {
    // Só as colunas conhecidas: os metadados do usuário são editáveis por ele.
    const row = Object.fromEntries(cols.split(", ").map((c) => [c, pending[c] ?? null]));
    ({ data: p } = await supabase.from("customers").upsert({ ...row, user_id: user.id }).select(cols).maybeSingle());
  }
  if (!p) return null;
  const pj = p.person_type === "pj";
  return {
    ...emptyProfile,
    ...Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v ?? ""])),
    person_type: pj ? "pj" : "pf",
    doc: (pj ? p.cnpj : p.cpf) ?? "",
    newsletter: Boolean(p.newsletter),
  } as ProfileValues;
}
