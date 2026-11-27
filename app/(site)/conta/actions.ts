"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AccountState = { ok?: boolean; error?: string; message?: string } | undefined;

const field = (fd: FormData, name: string, max: number) => String(fd.get(name) ?? "").trim().slice(0, max);

// Entrar sem senha: o Supabase manda um link para o e-mail; o link volta para /auth/callback.
export async function sendLoginLink(_: AccountState, fd: FormData): Promise<AccountState> {
  const email = field(fd, "email", 200).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Informe um e-mail válido." };
  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/conta`, shouldCreateUser: true },
  });
  if (error) {
    return {
      error:
        error.status === 429
          ? "Muitas tentativas. Aguarde alguns minutos e tente de novo."
          : "Não foi possível enviar o link agora. Tente de novo em instantes.",
    };
  }
  return { ok: true, message: email };
}

export async function saveProfile(_: AccountState, fd: FormData): Promise<AccountState> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: "Sua sessão expirou. Entre de novo." };
  const { error } = await supabase.from("customers").upsert({
    user_id: data.user.id,
    name: field(fd, "name", 120) || null,
    company: field(fd, "company", 160) || null,
    cnpj: field(fd, "cnpj", 20) || null,
    phone: field(fd, "phone", 40) || null,
  });
  if (error) return { error: "Não foi possível salvar. Tente de novo." };
  return { ok: true };
}

export async function signOutCustomer() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/conta");
}

// Dados para preencher o pedido por e-mail de quem está logado (null para visitante).
export async function getMyProfile() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: p } = await supabase.from("customers").select("name, company, phone").eq("user_id", data.user.id).maybeSingle();
  return { email: data.user.email ?? "", name: p?.name ?? "", company: p?.company ?? "", phone: p?.phone ?? "" };
}

type Item = { slug: string; name: string; sku: string | null; qty: number };

// Envio pelo WhatsApp de quem está logado: entra no histórico da conta (visitante não grava nada).
export async function logWhatsappQuote(raw: Item[]) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email || !Array.isArray(raw) || raw.length === 0) return;
  const items = raw.slice(0, 200).map((i) => ({
    slug: String(i.slug).slice(0, 120),
    name: String(i.name).slice(0, 300),
    sku: i.sku ? String(i.sku).slice(0, 60) : null,
    qty: Math.min(9999, Math.max(1, Math.round(Number(i.qty) || 1))),
  }));
  const { data: p } = await supabase.from("customers").select("name, company, phone").eq("user_id", data.user.id).maybeSingle();
  await supabase.from("quote_requests").insert({
    user_id: data.user.id,
    channel: "whatsapp",
    status: "respondido",
    name: p?.name || data.user.email.split("@")[0],
    company: p?.company ?? null,
    phone: p?.phone ?? null,
    email: data.user.email,
    items,
  });
}
