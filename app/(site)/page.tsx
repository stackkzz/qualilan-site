import Image from "next/image";
import Link from "next/link";
import { NetworkMap } from "@/components/network-map";
import { QuoteSteps } from "@/components/quote-steps";
import { TestimonialsMarquee } from "@/components/testimonials-marquee";
import { Wave } from "@/components/wave";
import {
  categories,
  customProjects,
  differentials,
  mapsHref,
  partners,
  telHref,
  units,
  whatsappLink,
} from "@/lib/site";
import cityNight from "@/public/ref/city-night.jpg";

const quoteMessage = "Olá, Qualilan! Gostaria de um orçamento.";
const specialistMessage = "Olá, Qualilan! Gostaria de falar com um especialista sobre um projeto.";

function SectionHeading({ title, text, light }: { title: string; text?: string; light?: boolean }) {
  return (
    <div className="reveal-title max-w-2xl">
      <h2
        className={`text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem] md:leading-[1.1] ${light ? "text-white" : "text-profundo"}`}
      >
        {title}
      </h2>
      {text && (
        <p className={`mt-4 text-[17px] leading-relaxed ${light ? "text-white/70" : "text-marinho/65"}`}>{text}</p>
      )}
    </div>
  );
}

function WhatsAppButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <a
      href={whatsappLink(message)}
      className="inline-flex items-center gap-2 rounded-lg bg-laranja px-6 py-3.5 font-semibold text-profundo transition-colors hover:bg-amarelo"
    >
      <span className="icon text-xl!">chat</span>
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <main className="overflow-x-clip">
      {/* Hero: foto de cidade com trilhas de luz e a camada azul pedida no manual da marca. */}
      <section className="relative overflow-hidden bg-profundo text-white">
        <div aria-hidden className="parallax absolute inset-x-0 -top-[15%] h-[130%]">
          <Image src={cityNight} alt="" fill preload placeholder="blur" sizes="100vw" className="hero-photo object-cover object-right" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-profundo via-profundo/90 to-profundo/45" />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 md:pb-28 md:pt-24">
          <h1 className="hero-title max-w-2xl text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] md:text-[4rem]">
            Infraestrutura inteligente para a sua empresa.
          </h1>
          <p style={{ "--i": 1 } as React.CSSProperties} className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Infraestrutura de rede, segurança eletrônica e conectividade das marcas líderes, com pronta entrega em
            cinco unidades.
          </p>

          <form action="/catalogo" role="search" style={{ "--i": 2 } as React.CSSProperties} className="hero-in mt-10 max-w-xl">
            <label htmlFor="q" className="sr-only">
              Buscar no catálogo
            </label>
            <div className="flex items-center rounded-xl bg-white p-1.5 pl-4 text-marinho shadow-[0_24px_60px_-24px_rgba(0,0,26,0.7)]">
              <span className="icon text-marinho/40">search</span>
              <input
                id="q"
                name="q"
                type="search"
                placeholder="Produto, marca ou código"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-marinho/40"
              />
              <button
                type="submit"
                className="rounded-lg bg-profundo px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-royal"
              >
                Buscar
              </button>
            </div>
          </form>

          <p style={{ "--i": 3 } as React.CSSProperties} className="hero-in mt-5 text-sm leading-relaxed text-white/60">
            Mais procurados:{" "}
            {categories.slice(0, 5).map((c, i) => (
              <span key={c.slug}>
                <Link href={`/catalogo/${c.slug}`} className="text-white/85 underline-offset-4 hover:text-white hover:underline">
                  {c.name}
                </Link>
                {i < 4 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] lg:block">
          <div className="float-a absolute right-[18%] top-[26%] flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-md">
            <span className="grid size-9 place-items-center rounded-lg bg-laranja text-profundo">
              <span className="icon text-xl!">inventory_2</span>
            </span>
            <span>
              <span className="block font-semibold">Pronta entrega</span>
              <span className="text-white/70">em 5 unidades</span>
            </span>
          </div>
          <div className="float-b absolute bottom-[22%] right-[30%] flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-md">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full rounded-full bg-[#25d366] opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[#25d366]" />
            </span>
            <span>
              <span className="block font-semibold">Orçamento pelo WhatsApp</span>
              <span className="text-white/70">sem cadastro</span>
            </span>
          </div>
        </div>
      </section>

      <Wave top="text-profundo" bottom="bg-white" />

      {/* Parceiros */}
      <section aria-labelledby="parceiros" className="bg-white pb-20 pt-6">
        <div className="mx-auto max-w-6xl px-5">
          <h2 id="parceiros" className="text-center text-[15px] font-medium text-marinho/60">
            Parceira comercial de grandes marcas nacionais e internacionais
          </h2>
          <div id="marcas" className="marquee mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <ul className="marquee-track flex w-max items-center gap-x-16 gap-y-8">
              {[...partners, ...partners].map((p, i) => {
                const copy = i >= partners.length;
                return (
                  <li key={i} aria-hidden={copy || undefined} className={copy ? "marquee-copy shrink-0" : "shrink-0"}>
                    <Image src={p.logo} alt={copy ? "" : p.name} width={p.w} height={p.h} className="h-10 w-32 object-contain" />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="border-t border-profundo/10 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              title="Catálogo completo para o seu projeto"
              text="Do cabo ao rack, do switch à câmera. Monte sua lista e receba o orçamento pelo WhatsApp."
            />
            <Link href="/catalogo" className="shrink-0 font-semibold text-royal hover:text-profundo">
              Ver todo o catálogo
            </Link>
          </div>
          <ul className="reveal mt-12 grid grid-cols-2 border-l border-t border-profundo/10 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.slug} className="border-b border-r border-profundo/10">
                <Link
                  href={`/catalogo/${c.slug}`}
                  className="group relative isolate flex h-full items-center gap-4 overflow-hidden px-5 py-6 before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-profundo before:transition-transform before:duration-300 hover:before:scale-y-100 focus-visible:before:scale-y-100"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-royal/8 text-royal transition-colors duration-300 group-hover:bg-white/10 group-hover:text-amarelo">
                    <span className="icon">{c.icon}</span>
                  </span>
                  <span className="font-medium text-profundo transition-colors duration-300 group-hover:text-white">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Diferenciais, com os ícones do site institucional */}
      <section id="segmentos" className="bg-offwhite py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading title="Por que grandes empresas confiam na Qualilan" />
          <ul className="reveal mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {differentials.map((d) => (
              <li key={d.title}>
                <Image src={d.icon} alt="" width={56} height={56} className="size-14 object-contain" />
                <h3 className="mt-5 font-semibold leading-snug text-profundo">{d.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marinho/65">{d.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14">
            <WhatsAppButton message={specialistMessage}>Fale com um especialista</WhatsAppButton>
          </div>
        </div>
      </section>

      {/* Logística + unidades */}
      <section id="unidades" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionHeading
                title="Logística eficiente e ágil"
                text="Logística própria e parcerias estratégicas: entregamos onde e quando você precisa."
              />
              <dl className="reveal mt-10 space-y-6">
                {[
                  { k: "5 unidades", v: "em Campinas, São Paulo, Bauru, Jacareí e Minas Gerais" },
                  { k: "Pronta entrega", v: "nas 5 unidades, com o estoque mais próximo de você" },
                  { k: "Todo o Brasil", v: "entregas nacionais com logística própria e parceiros" },
                ].map((s) => (
                  <div key={s.k} className="border-l-2 border-laranja pl-5">
                    <dt className="text-xl font-bold tracking-tight text-profundo">{s.k}</dt>
                    <dd className="mt-1 text-[15px] text-marinho/65">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="reveal-title overflow-hidden rounded-3xl bg-profundo p-4 shadow-[0_40px_80px_-40px_rgba(18,23,68,0.6)] md:p-6">
              <NetworkMap />
            </div>
          </div>
          <ul className="reveal mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {units.map((u) => {
              return (
                <li
                  key={u.city}
                  className="lift flex flex-col rounded-2xl border border-profundo/10 bg-white p-5 text-profundo"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="grid size-10 place-items-center rounded-lg bg-royal/8 text-royal"
                    >
                      <span className="icon text-xl!">location_on</span>
                    </span>
                    {u.note && (
                      <span className="rounded-full bg-laranja px-2.5 py-0.5 text-xs font-semibold text-profundo">{u.note}</span>
                    )}
                  </div>
                  <p className="mt-5 text-lg font-semibold">{u.city}</p>
                  <address className="mt-2 flex-1 text-sm not-italic leading-relaxed text-marinho/60">
                    {u.address}
                  </address>
                  <div className="mt-5 space-y-2 border-t border-profundo/10 pt-4">
                    <a href={telHref(u.phone)} className="flex items-center gap-2 font-semibold hover:underline">
                      <span className="icon text-lg! text-royal">call</span>
                      {u.phone}
                    </a>
                    <a
                      href={mapsHref(u.address)}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-2 text-sm text-royal hover:underline"
                    >
                      <span className="icon text-lg!">map</span>
                      Ver no mapa
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Projetos customizados */}
      <section className="bg-profundo py-24 text-white md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            light
            title="Projetos customizados para os desafios de cada negócio"
            text="Além do catálogo, desenvolvemos projetos completos com parceiros especializados."
          />
          <ul className="wipe mt-12 grid gap-6 md:grid-cols-2">
            {customProjects.map((p) => (
              <li key={p.partner} className="group relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl p-8">
                <Image src={p.image} alt="" fill sizes="(min-width: 768px) 560px, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-marinho via-profundo/85 to-profundo/40" />
                <Image src={p.logo} alt={p.partner} width={1080} height={246} className="h-9 w-auto self-start" />
                <h3 className="mt-6 text-2xl font-bold">{p.title}</h3>
                <p className="mt-2 max-w-md text-white/75">{p.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <WhatsAppButton message={specialistMessage}>Fale com um especialista</WhatsAppButton>
          </div>
        </div>
      </section>

      <QuoteSteps />

      <TestimonialsMarquee />

      {/* Chamada final */}
      <section className="bg-white pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden rounded-3xl bg-profundo px-8 py-12 text-white md:px-14 md:py-16">
            {/* Símbolo Q da marca emitindo sinal: anéis que se expandem e um brilho laranja respirando. */}
            <div aria-hidden className="pointer-events-none absolute right-8 top-1/2 hidden size-[22rem] -translate-y-1/2 md:block lg:right-16">
              <span className="q-glow absolute inset-12 rounded-full bg-laranja/60 blur-3xl" />
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{ animationDelay: `${i * 1.2}s` }}
                  className={`q-ripple absolute inset-0 rounded-full border-2 ${i === 1 ? "border-laranja/60" : "border-white/35"}`}
                />
              ))}
              <Image
                src="/brand/q-branco.png"
                alt=""
                width={1204}
                height={1244}
                className="q-float absolute inset-14 h-auto w-[calc(100%-7rem)] drop-shadow-[0_20px_40px_rgba(0,0,26,0.5)]"
              />
            </div>
            <div className="relative max-w-xl">
              <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-4xl">
                Você busca produtos de rede de qualidade, entrega rápida e suporte especializado?
              </h2>
              <p className="mt-4 text-[17px] text-white/70">Nossa equipe analisa a sua necessidade e envia uma cotação personalizada.</p>
              <div className="mt-8">
                <WhatsAppButton message={quoteMessage}>Solicitar orçamento</WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
