import Image from "next/image";
import { googleRating, testimonials, type Testimonial } from "@/lib/site";

function initials(name: string) {
  const parts = name.split(" ");
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function Card({ t, full }: { t: Testimonial; full?: boolean }) {
  return (
    <figure className={`flex h-full flex-col ${full ? "w-full" : "w-[20rem] md:w-[24rem]"} rounded-2xl border border-profundo/10 bg-white p-6`}>
      <div className="text-amarelo" aria-label="5 estrelas">
        ★★★★★
      </div>
      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-marinho/85">“{t.text}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {t.photo ? (
          <Image src={t.photo} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
        ) : (
          <span className="grid size-10 place-items-center rounded-full bg-royal/10 text-sm font-semibold text-royal">
            {initials(t.name)}
          </span>
        )}
        <span className="text-sm">
          <span className="block font-semibold text-profundo">{t.name}</span>
          <span className="text-marinho/55">
            {t.source === "Google" ? `Avaliação no Google, unidade ${t.unit}` : "Cliente Qualilan"}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

// Duas faixas em sentidos opostos; a segunda cópia de cada faixa só existe para o loop ficar contínuo.
function Row({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  return (
    <div className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <ul className={`marquee-track marquee-slow flex w-max items-stretch gap-5 py-2 ${reverse ? "marquee-reverse" : ""}`}>
        {[...items, ...items].map((t, i) => {
          const copy = i >= items.length;
          return (
            <li key={i} aria-hidden={copy || undefined} className={copy ? "marquee-copy shrink-0" : "shrink-0"}>
              <Card t={t} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function TestimonialsMarquee() {
  const half = Math.ceil(testimonials.length / 2);
  return (
    <section className="border-t border-profundo/10 bg-white py-24 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-5 md:flex-row md:items-end">
        <h2 className="reveal-title text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem]">
          O que dizem nossos clientes
        </h2>
        <div className="flex items-center gap-4 rounded-2xl border border-profundo/10 px-5 py-3">
          <span className="text-4xl font-bold tracking-tight text-profundo">{googleRating.score}</span>
          <span className="text-sm">
            <span className="block text-amarelo" aria-hidden>
              ★★★★★
            </span>
            <span className="text-marinho/60">
              {googleRating.count} avaliações no Google ({googleRating.unit})
            </span>
          </span>
        </div>
      </div>
      {/* Meio-termo: no computador as faixas rolam (e param com o mouse em cima); no celular, 3 depoimentos fixos */}
      <div className="mt-12 hidden space-y-5 md:block">
        <Row items={testimonials.slice(0, half)} />
        <Row items={testimonials.slice(half)} reverse />
      </div>
      <div className="mt-10 space-y-4 px-5 md:hidden">
        {testimonials.slice(0, 3).map((t) => (
          <Card key={t.name} t={t} full />
        ))}
        <a
          href="https://www.google.com/maps/search/?api=1&query=Qualilan%20Bauru"
          target="_blank"
          rel="noopener"
          className="flex items-center justify-center gap-1 rounded-full border-2 border-profundo/15 px-5 py-3 font-semibold text-profundo"
        >
          Ver todas as avaliações no Google
          <span className="icon text-xl!">chevron_right</span>
        </a>
      </div>
    </section>
  );
}
