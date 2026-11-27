import { cacheLife, cacheTag } from "next/cache";
import { createSupabasePublicClient } from "./supabase/server";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string | null;
  body: string;
  publishedAt: string;
};

export const POSTS_TAG = "posts";

// Todos os posts publicados em cache; o painel invalida a tag "posts" ao salvar.
export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("days");
  const { data, error } = await createSupabasePublicClient()
    .from("posts")
    .select("slug, title, excerpt, category, cover_url, body, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw new Error(`Falha ao carregar o blog: ${error.message}`);
  return data.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category,
    cover: r.cover_url,
    body: r.body,
    publishedAt: r.published_at,
  }));
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
}

// ~200 palavras por minuto, mínimo de 1 minuto.
export function readingMinutes(body: string) {
  return Math.max(1, Math.round(body.split(/\s+/).length / 200));
}
