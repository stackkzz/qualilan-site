import Link from "next/link";
import { getPosts } from "@/lib/blog";
import { PostCard } from "./post-card";

// Últimos posts na Home. Some sozinho enquanto o blog não tiver posts.
export async function BlogTeaser() {
  const posts = (await getPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="bg-offwhite py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="reveal-title max-w-2xl">
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem] md:leading-[1.1]">
              Do nosso blog
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-marinho/65">
              Conteúdo técnico para especificar e comprar infraestrutura com segurança.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded-full border-2 border-profundo/15 px-5 py-2.5 font-semibold text-profundo transition-colors hover:border-profundo"
          >
            Ver todos os artigos
            <span className="icon text-xl!">chevron_right</span>
          </Link>
        </div>
        <ul className="reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug} className="flex">
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
