"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, slugify } from "@/lib/admin";
import { PRODUCTS_TAG } from "@/lib/catalog";
import { categories } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FormState = { error?: string } | undefined;

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // abaixo do limite de 4,5 MB do corpo da requisição na Vercel
const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const BUCKET = "produtos";

export async function signIn(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Preencha e-mail e senha." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-mail ou senha incorretos." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Este usuário não tem acesso ao painel. Peça a liberação ao responsável pelo site." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function text(formData: FormData, name: string, max: number) {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, max);
}

export async function saveProduct(_: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id", 64) || null;
  const name = text(formData, "name", 300);
  const category = text(formData, "category", 64);
  if (name.length < 2) return { error: "Informe o nome do produto." };
  if (!categories.some((c) => c.slug === category)) return { error: "Escolha uma categoria." };

  const fields = {
    name,
    category,
    sku: text(formData, "sku", 60) || null,
    brand: text(formData, "brand", 60) || null,
    mfr_code: text(formData, "mfr_code", 60) || null,
    unit: text(formData, "unit", 60) || null,
    subcategory: text(formData, "subcategory", 60) || null,
    description: text(formData, "description", 5000),
    in_stock: formData.get("in_stock") === "on",
    published: formData.get("published") === "on",
  };

  let image_url: string | undefined;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const ext = IMAGE_TYPES[file.type];
    if (!ext) return { error: "A foto precisa ser JPG, PNG ou WebP." };
    if (file.size > MAX_IMAGE_BYTES) return { error: "A foto precisa ter até 4 MB." };
    const path = `${slugify(name) || "produto"}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    if (error) return { error: `Não foi possível enviar a foto: ${error.message}` };
    image_url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  if (id) {
    const { error } = await supabase
      .from("products")
      .update({ ...fields, ...(image_url ? { image_url } : {}) })
      .eq("id", id);
    if (error) return { error: `Não foi possível salvar: ${error.message}` };
  } else {
    // O link do produto nasce do nome e não muda depois, para não quebrar links já compartilhados.
    const base = slugify(name) || "produto";
    let slug = base;
    for (let attempt = 0; ; attempt++) {
      const { error } = await supabase.from("products").insert({ ...fields, slug, image_url: image_url ?? null });
      if (!error) break;
      if (error.code !== "23505" || attempt >= 3) return { error: `Não foi possível criar: ${error.message}` };
      slug = `${base}-${crypto.randomUUID().slice(0, 4)}`;
    }
  }

  updateTag(PRODUCTS_TAG);
  redirect(`/admin?salvo=${encodeURIComponent(name)}`);
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id", 64);
  const { data } = await supabase.from("products").delete().eq("id", id).select("name, image_url").single();

  // Apaga a foto só se ela estiver no nosso bucket (as importadas ainda vêm da loja antiga).
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  if (data?.image_url?.includes(marker)) {
    await supabase.storage.from(BUCKET).remove([data.image_url.split(marker)[1]]);
  }
  updateTag(PRODUCTS_TAG);
  redirect(data ? `/admin?removido=${encodeURIComponent(data.name)}` : "/admin");
}
