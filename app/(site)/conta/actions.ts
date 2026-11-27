"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isValidCNPJ, isValidCPF, onlyDigits } from "@/lib/documents";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AccountState = { ok?: boolean; error?: string; message?: string } | undefined;

const field = (fd: FormData, name: string, max: number) => String(fd.get(name) ?? "").trim().slice(0, max);
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const UF = new Set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" "));

async function origin() {
  const h = await headers();
  return h.get("origin") ?? `https://${h.get("host")}`;
}

// Dados do cadastro (mesmos campos da loja antiga), validados. Usado ao criar a conta e ao editar.
function readProfile(fd: FormData) {
  const personType = fd.get("person_type") === "pj" ? "pj" : "pf";
  const doc = onlyDigits(field(fd, "doc", 20));
  const p = {
    person_type: personType,
    name: field(fd, "name", 120),
    last_name: field(fd, "last_name", 120) || null,
    company: field(fd, "company", 160) || null,
    cpf: personType === "pf" ? doc : null,
    cnpj: personType === "pj" ? doc : null,
    rg_ie: field(fd, "rg_ie", 30) || null,
    phone: field(fd, "phone", 40) || null,
    cep: onlyDigits(field(fd, "cep", 9)) || null,
    street: field(fd, "street", 160) || null,
    number: field(fd, "number", 20) || null,
    complement: field(fd, "complement", 80) || null,
    district: field(fd, "district", 80) || null,
    city: field(fd, "city", 80) || null,
    state: field(fd, "state", 2).toUpperCase() || null,
    newsletter: fd.get("newsletter") === "on",
  };
  if (p.name.length < 2) return { error: "Informe o nome." };
  if (personType === "pf" && !isValidCPF(doc)) return { error: "CPF inválido. Confira os números." };
  if (personType === "pj" && !isValidCNPJ(doc)) return { error: "CNPJ inválido. Confira os números." };
  if (personType === "pj" && !p.company) return { error: "Informe a razão social da empresa." };
  if (p.cep && p.cep.length !== 8) return { error: "CEP inválido." };
  if (p.state && !UF.has(p.state)) return { error: "Estado inválido." };
  return { data: p };
}

export async function signInCustomer(_: AccountState, fd: FormData): Promise<AccountState> {
  const email = field(fd, "email", 200).toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!EMAIL.test(email) || !password) return { error: "Preencha e-mail e senha." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === "email_not_confirmed") return { error: "Confirme seu e-mail pelo link que enviamos antes de entrar." };
    if (error.status === 429) return { error: "Muitas tentativas. Aguarde alguns minutos." };
    return { error: "E-mail ou senha incorretos." };
  }
  redirect("/conta");
}

export async function signUpCustomer(_: AccountState, fd: FormData): Promise<AccountState> {
  const parsed = readProfile(fd);
  if (parsed.error || !parsed.data) return { error: parsed.error };
  const email = field(fd, "email", 200).toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!EMAIL.test(email)) return { error: "Informe um e-mail válido." };
  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
  if (password !== String(fd.get("password_confirm") ?? "")) return { error: "As senhas não conferem." };

  const supabase = await createSupabaseServerClient();
  // Os dados vão também no cadastro: se o Supabase exigir confirmação de e-mail, o perfil é criado no 1º acesso.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${await origin()}/auth/callback?next=/conta`, data: { profile: parsed.data } },
  });
  if (error) {
    if (error.code === "user_already_exists") return { error: "Já existe uma conta com este e-mail. Entre ou recupere a senha." };
    if (error.code === "weak_password") return { error: "Senha fraca. Use letras e números, com pelo menos 8 caracteres." };
    if (error.status === 429) return { error: "Muitas tentativas. Aguarde alguns minutos." };
    return { error: "Não foi possível criar a conta agora. Tente de novo." };
  }
  // Supabase devolve usuário sem identidades quando o e-mail já existe e a confirmação está ligada.
  if (data.user && data.user.identities?.length === 0) {
    return { error: "Já existe uma conta com este e-mail. Entre ou recupere a senha." };
  }
  if (data.session && data.user) {
    await supabase.from("customers").upsert({ user_id: data.user.id, ...parsed.data });
    redirect("/conta");
  }
  return { ok: true, message: email };
}

// Esqueci a senha: e-mail com link; o link volta para /conta/nova-senha já logado.
export async function requestPasswordReset(_: AccountState, fd: FormData): Promise<AccountState> {
  const email = field(fd, "email", 200).toLowerCase();
  if (!EMAIL.test(email)) return { error: "Informe um e-mail válido." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await origin()}/auth/callback?next=/conta/nova-senha`,
  });
  if (error?.status === 429) return { error: "Muitas tentativas. Aguarde alguns minutos." };
  // Mesma resposta exista ou não a conta: não revela quais e-mails estão cadastrados.
  return { ok: true, message: email };
}

export async function updatePassword(_: AccountState, fd: FormData): Promise<AccountState> {
  const password = String(fd.get("password") ?? "");
  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
  if (password !== String(fd.get("password_confirm") ?? "")) return { error: "As senhas não conferem." };
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: "O link expirou. Peça um novo em “Esqueceu a sua senha?”." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.code === "same_password" ? "A nova senha precisa ser diferente da anterior." : "Não foi possível trocar a senha." };
  redirect("/conta?senha=ok");
}

export async function saveProfile(_: AccountState, fd: FormData): Promise<AccountState> {
  const parsed = readProfile(fd);
  if (parsed.error || !parsed.data) return { error: parsed.error };
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: "Sua sessão expirou. Entre de novo." };
  const { error } = await supabase.from("customers").upsert({ user_id: data.user.id, ...parsed.data });
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
  const { data: p } = await supabase
    .from("customers")
    .select("name, last_name, company, phone")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return {
    email: data.user.email ?? "",
    name: [p?.name, p?.last_name].filter(Boolean).join(" "),
    company: p?.company ?? "",
    phone: p?.phone ?? "",
  };
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
