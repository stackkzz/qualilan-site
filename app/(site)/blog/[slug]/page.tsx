import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { Markdown } from "@/components/markdown";
import { PostCard } from "@/components/post-card";
import { WhatsAppIcon, whatsappButtonDarkClass } from "@/components/whatsapp-icon";
import { formatDate, getPost, getPosts, readingMinutes } from "@/lib/blog";
import { getProducts } from "@/lib/catalog";
import { whatsappLink } from "@/lib/site";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} | Blog Qualilan`,
    description: post.excerpt,
    openGraph: { type: "article", publishedTime: post.publishedAt, images: post.cover ? [post.cover] : undefined },
  };
}

// Leitura de params dentro de Suspense: exigência da navegação instantânea (Cache Components).
export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<PageLoader />}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const [posts, products] = await Promise.all([getPosts(), getProducts()]);
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: post.cover ?? undefined,
    author: { "@type": "Organization", name: "Equipe técnica Qualilan" },
  };

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="bg-offwhite">
        <div className="mx-auto max-w-3xl px-5 pb-10 pt-12 md:pt-16">
          <nav aria-label="Você está em" className="text-sm text-marinho/60">
            <Link href="/blog" className="hover:text-royal">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-royal">{post.category}</span>
          </nav>
          <h1 className="mt-5 text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] text-profundo md:text-[2.75rem]">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-marinho/70">{post.excerpt}</p>
          <p className="mt-6 flex items-center gap-2 text-sm text-marinho/50">
            <span className="icon text-lg!">schedule</span>
            Por equipe técnica Qualilan, {formatDate(post.publishedAt)}, {readingMinutes(post.body)} min de leitura
          </p>
        </div>
      </header>

      {post.cover && (
        <div className="bg-[linear-gradient(to_bottom,var(--color-offwhite)_50%,white_50%)]">
          <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl md:mx-auto">
            <Image src={post.cover} alt="" fill preload sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      <article className="post-body mx-auto max-w-[68ch] px-5 py-12 md:py-16">
        <Markdown source={post.body} products={products} />
      </article>

      <aside className="mx-auto max-w-3xl px-5 pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-profundo p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-xl font-bold">Precisa de ajuda com o seu projeto?</p>
            <p className="mt-2 text-white/70">Nosso time técnico indica a solução certa e envia o orçamento.</p>
          </div>
          <a
            href={whatsappLink(`Olá, Qualilan! Li o artigo "${post.title}" e gostaria de falar com um especialista.`)}
            className={`shrink-0 ${whatsappButtonDarkClass}`}
          >
            <WhatsAppIcon />
            Falar com um especialista
          </a>
        </div>
      </aside>

      {related.length > 0 && (
        <section className="bg-offwhite py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-2xl font-bold tracking-tight text-profundo md:text-3xl">Continue lendo</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug} className="flex">
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
