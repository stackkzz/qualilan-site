import Image from "next/image";
import { WhatsAppIcon, whatsappButtonDarkClass } from "@/components/whatsapp-icon";
import Link from "next/link";
import { BlogTeaser } from "@/components/blog-teaser";
import { getProducts, listedCategories } from "@/lib/catalog";
import { FiberLines } from "@/components/fiber-lines";
import { RackVisual } from "@/components/rack-visual";
import { IconTile } from "@/components/icon-tile";
import { NetworkMap } from "@/components/network-map";
import { QuoteSteps } from "@/components/quote-steps";
import { TestimonialsMarquee } from "@/components/testimonials-marquee";
import { VideoCases } from "@/components/video-cases";
import { Wave } from "@/components/wave";
import {
  addressLines,
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
      className={whatsappButtonDarkClass}
    >
      <WhatsAppIcon />
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
            Infraestrutura de rede, segurança eletrônica e conectividade das marcas líderes, para empresas de todos
            os portes.
          </p>

          <form action="/catalogo" role="search" style={{ "--i": 2 } as React.CSSProperties} className="hero-in mt-10 max-w-xl">
            <label htmlFor="q" className="sr-only">
              Buscar no catálogo
            </label>
            <div className="flex items-center rounded-xl bg-white p-1.5 pl-4 text-marinho shadow-[0_24px_60px_-24px_rgba(0,0,26,0.7)] transition-shadow focus-within:ring-4 focus-within:ring-laranja/40">
              <span className="icon text-marinho/40">search</span>
              <input
                id="q"
                name="q"
                type="search"
                placeholder="Nome, marca ou código"
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

          {/* Mais procurados em pílulas: área de toque confortável no celular */}
          <div style={{ "--i": 3 } as React.CSSProperties} className="hero-in mt-5 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <span className="mr-1">Mais procurados:</span>
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.slug}
                href={`/catalogo/${c.slug}`}
                className="rounded-full border border-white/20 px-3 py-1.5 text-white/85 transition-colors hover:border-white/50 hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] lg:block">
          <div className="float-a absolute right-[18%] top-[26%] flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-md">
            <span className="grid size-9 place-items-center rounded-lg bg-laranja text-profundo">
              <span className="icon text-xl!">verified</span>
            </span>
            <span>
              <span className="block font-semibold">Distribuidor autorizado</span>
              <span className="text-white/70">das marcas líderes</span>
            </span>
          </div>
          <div className="float-b absolute bottom-[22%] right-[30%] flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-md">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full rounded-full bg-[#25d366] opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[#25d366]" />
            </span>
            <span>
              <span className="block font-semibold">Orçamento pelo WhatsApp</span>
              <span className="text-white/70">monte a lista no site</span>
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
                    <Image src={p.logo} alt={copy ? "" : p.name} width={Math.round((p.w * 40) / p.h)} height={40} className="h-10 w-32 object-contain" />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <CategoriesSection />

      {/* Diferenciais, com os ícones do site institucional */}
      <section id="segmentos" className="bg-offwhite py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading title="Por que grandes empresas confiam na Qualilan" />
          <ul className="reveal mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {differentials.map((d) => (
              <li key={d.title} className="group">
                <IconTile icon={d.icon} size="lg" />
                <h3 className="mt-5 font-semibold leading-snug text-profundo">{d.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marinho/65">{d.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Logística + unidades */}
      <section id="unidades" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionHeading
                title="Logística eficiente e ágil"
                text="Entregamos onde e quando você precisa."
              />
              <dl className="reveal mt-10 space-y-6">
                {[
                  { k: "Logística própria", v: "com parcerias estratégicas, para mais agilidade e segurança no seu projeto" },
                  { k: "Todo o Brasil", v: "entregas nacionais a partir das unidades de SP e MG" },
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
          {/* No celular, os cards rolam para o lado (antes eram 5 cards empilhados, ~2.400 px) */}
          <ul className="reveal no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
            {units.map((u) => {
              return (
                <li
                  key={u.city}
                  className="lift group flex w-[80%] shrink-0 snap-start flex-col rounded-2xl border border-profundo/10 bg-white p-5 text-profundo sm:w-auto"
                >
                  <div className="flex items-center justify-between">
                    <IconTile icon="location_on" size="sm" />
                    {u.note && (
                      <span className="rounded-full bg-laranja px-2.5 py-0.5 text-xs font-semibold text-profundo">{u.note}</span>
                    )}
                  </div>
                  <p className="mt-5 text-lg font-semibold">{u.city}</p>
                  <address className="mt-2 flex-1 text-sm not-italic leading-relaxed text-marinho/60">
                    {addressLines(u.address)[0]}
                    <br />
                    {addressLines(u.address)[1]}
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
      <section id="projetos" className="relative isolate overflow-hidden bg-profundo py-24 text-white md:py-32">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10 opacity-60" />
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            light
            title="Projetos customizados para os desafios de cada negócio"
            text="Além do catálogo, desenvolvemos projetos completos com parceiros especializados."
          />
          <ul className="reveal mt-12 grid gap-6 md:grid-cols-2">
            {customProjects.map((p) => (
              <li key={p.partner} className="group flex flex-col overflow-hidden rounded-3xl bg-[#1A2056] ring-1 ring-white/10 transition-shadow hover:ring-white/25">
                {/* Visual próprio de cada parceiro: fibras para a rede óptica, racks para o data center */}
                <div className="relative isolate h-48 overflow-hidden border-b border-white/10 bg-marinho/40">
                  <div aria-hidden className="tech-grid absolute inset-0 -z-10" />
                  {p.visual === "fiber" ? <FiberLines masked={false} /> : <RackVisual />}
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <Image src={p.logo} alt={p.partner} width={140} height={32} className="h-8 w-auto self-start" />
                  <h3 className="mt-6 text-2xl font-bold">{p.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-white/70">{p.text}</p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-[15px] text-white/85">
                        <span className="icon text-xl! text-laranja">check</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {"href" in p && (
                    <Link href={p.href} className="mt-8 inline-flex items-center gap-1 self-start font-semibold text-amarelo hover:underline">
                      {p.hrefLabel}
                      <span className="icon text-xl!">chevron_right</span>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <WhatsAppButton message={specialistMessage}>Fale com um especialista</WhatsAppButton>
          </div>
        </div>
      </section>

      <VideoCases />

      <QuoteSteps />

      <TestimonialsMarquee />

      <BlogTeaser />

      {/* Chamada final: faixa de ponta a ponta, com o mesmo fundo de grade e fibras do Sobre */}
      <section className="relative isolate overflow-hidden bg-profundo py-20 text-white md:py-28">
        <div aria-hidden className="tech-grid absolute inset-0 -z-10" />
        <FiberLines className="-z-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="reveal-title max-w-xl">
            <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-[2.75rem] md:leading-[1.1]">
              Você busca produtos de rede de qualidade, entrega rápida e suporte especializado?
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-white/70">
              Nossa equipe analisa a sua necessidade e envia uma cotação personalizada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton message={quoteMessage}>Solicitar orçamento</WhatsAppButton>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-1 rounded-full px-5 py-3 font-semibold text-white/80 hover:text-white"
              >
                Ver o catálogo
                <span className="icon text-xl!">chevron_right</span>
              </Link>
            </div>
          </div>
          {/* Símbolo Q limpo (o manual proíbe brilho e sombra no logo), com anéis de sinal ao redor. */}
          <div aria-hidden className="pointer-events-none relative mx-auto hidden aspect-square w-full max-w-[22rem] md:block">
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
              className="q-float absolute inset-14 h-auto w-[calc(100%-7rem)]"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// Só categorias com produto; o título usa a contagem real do catálogo (arredondada para baixo).
async function CategoriesSection() {
  const [list, products] = await Promise.all([listedCategories(), getProducts()]);
  const total = Math.floor(products.length / 10) * 10;
  return (
      <section className="border-t border-profundo/10 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              title={`Mais de ${total} produtos para o seu projeto`}
              text="Do cabo ao rack, do switch à câmera. Monte sua lista e receba o orçamento pelo WhatsApp."
            />
            <Link href="/catalogo" className="shrink-0 font-semibold text-royal hover:text-profundo">
              Ver todo o catálogo
            </Link>
          </div>
          <ul className="reveal mt-12 grid grid-cols-2 border-l border-t border-profundo/10 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((c) => (
              <li key={c.slug} className="border-b border-r border-profundo/10">
                <Link
                  href={`/catalogo/${c.slug}`}
                  className="group relative isolate flex h-full items-center gap-4 overflow-hidden px-5 py-6 before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-profundo before:transition-transform before:duration-300 hover:before:scale-y-100 focus-visible:before:scale-y-100"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-royal/8 text-royal transition-colors duration-300 group-hover:bg-white/10 group-hover:text-amarelo">
                    <span className="icon icon-hover-fill">{c.icon}</span>
                  </span>
                  <span className="font-medium text-profundo transition-colors duration-300 group-hover:text-white">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
  );
}
