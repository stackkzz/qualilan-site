import type { Metadata } from "next";
import { FiberLines } from "@/components/fiber-lines";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Qualilan",
  description: "Conteúdo técnico sobre redes, fibra óptica, segurança eletrônica e infraestrutura para empresas.",
};

export default async function BlogPage() {
  const [featured, ...rest] = await getPosts();

  return (
    <main className="bg-offwhite">
      <section className="relative isolate overflow-hidden bg-profundo text-white">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10" />
        <FiberLines className="-z-10" />
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h1 className="hero-title max-w-2xl text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] md:text-[3.5rem]">
            Blog da Qualilan
          </h1>
          <p style={{ "--i": 1 } as React.CSSProperties} className="hero-in mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Conteúdo técnico para quem especifica, instala e compra infraestrutura: redes, fibra óptica, segurança
            eletrônica e tecnologia para empresas.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        {featured ? (
          <>
            <PostCard post={featured} featured />
            {rest.length > 0 && (
              <ul className="reveal mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <li key={p.slug} className="flex">
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-marinho/60">Em breve, os primeiros artigos.</p>
        )}
      </div>
    </main>
  );
}
