"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, slugify } from "@/lib/admin";
import { POSTS_TAG } from "@/lib/blog";
import type { FormState } from "@/app/admin/actions";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // abaixo do limite de 4,5 MB do corpo da requisição na Vercel
const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const BUCKET = "produtos"; // mesmo bucket público das fotos, na pasta blog/

function text(formData: FormData, name: string, max: number) {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, max);
}

export async function savePost(_: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id", 64) || null;
  const title = text(formData, "title", 200);
  if (title.length < 3) return { error: "Informe o título do artigo." };
  const date = text(formData, "published_at", 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Informe a data de publicação." };

  const fields = {
    title,
    excerpt: text(formData, "excerpt", 400),
    category: text(formData, "category", 60) || "Tecnologia",
    body: text(formData, "body", 60000),
    published: formData.get("published") === "on",
    published_at: `${date}T12:00:00-03:00`,
  };

  let cover_url: string | undefined;
  const file = formData.get("cover");
  if (file instanceof File && file.size > 0) {
    const ext = IMAGE_TYPES[file.type];
    if (!ext) return { error: "A capa precisa ser JPG, PNG ou WebP." };
    if (file.size > MAX_IMAGE_BYTES) return { error: "A capa precisa ter até 4 MB." };
    const path = `blog/${slugify(title) || "post"}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    if (error) return { error: `Não foi possível enviar a capa: ${error.message}` };
    cover_url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  if (id) {
    const { error } = await supabase
      .from("posts")
      .update({ ...fields, ...(cover_url ? { cover_url } : {}) })
      .eq("id", id);
    if (error) return { error: `Não foi possível salvar: ${error.message}` };
  } else {
    // O link do artigo nasce do título e não muda depois, para não quebrar links já compartilhados.
    const base = slugify(title) || "post";
    let slug = base;
    for (let attempt = 0; ; attempt++) {
      const { error } = await supabase.from("posts").insert({ ...fields, slug, cover_url: cover_url ?? null });
      if (!error) break;
      if (error.code !== "23505" || attempt >= 3) return { error: `Não foi possível criar: ${error.message}` };
      slug = `${base}-${crypto.randomUUID().slice(0, 4)}`;
    }
  }

  updateTag(POSTS_TAG);
  redirect(`/admin/blog?salvo=${encodeURIComponent(title)}`);
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id", 64);
  const { data } = await supabase.from("posts").delete().eq("id", id).select("title, cover_url").single();

  // Apaga a capa só se ela estiver no nosso bucket (as capas migradas ficam em /public).
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  if (data?.cover_url?.includes(marker)) {
    await supabase.storage.from(BUCKET).remove([data.cover_url.split(marker)[1]]);
  }
  updateTag(POSTS_TAG);
  redirect(data ? `/admin/blog?removido=${encodeURIComponent(data.title)}` : "/admin/blog");
}
