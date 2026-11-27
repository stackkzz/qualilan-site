import Image from "next/image";
import Link from "next/link";
import { Wave } from "@/components/wave";
import {
  categories,
  customProjects,
  differentials,
  mapsHref,
  partners,
  telHref,
  testimonials,
  units,
  whatsappLink,
} from "@/lib/site";
import cityNight from "@/public/ref/city-night.jpg";

const quoteMessage = "Olá, Qualilan! Gostaria de um orçamento.";
const specialistMessage = "Olá, Qualilan! Gostaria de falar com um especialista sobre um projeto.";

// Os arcos do "Q" da marca, abertos como ondas de sinal.
function SignalArcs() {
  const rings = [
    { r: 90, w: 22, o: 0.9, delay: 0 },
    { r: 170, w: 22, o: 0.55, delay: 120 },
    { r: 250, w: 20, o: 0.32, delay: 240 },
    { r: 330, w: 18, o: 0.18, delay: 360 },
  ];
  return (
    <svg viewBox="0 0 800 800" aria-hidden className="h-full w-full">
      {rings.map(({ r, w, o, delay }) => (
        <circle
          key={r}
          className="signal-arc"
          style={{ animationDelay: `${delay}ms` }}
          cx="400"
          cy="400"
          r={r}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={o * 0.35}
          strokeWidth={w}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="74 26"
          transform="rotate(52 400 400)"
        />
      ))}
      <circle
        className="signal-arc"
        style={{ animationDelay: "480ms" }}
        cx="400"
        cy="400"
        r="90"
        fill="none"
        stroke="#FF9900"
        strokeWidth="22"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="10 90"
        transform="rotate(-62 400 400)"
      />
    </svg>
  );
}

const steps = [
  { title: "Encontre os produtos", text: "Busque por nome, marca ou código no catálogo." },
  { title: "Monte sua lista", text: "Adicione os itens e as quantidades de que precisa." },
  { title: "Envie pelo WhatsApp", text: "A mensagem vai pronta para o nosso time de vendas." },
];

function SectionHeading({ title, text, light }: { title: string; text?: string; light?: boolean }) {
  return (
    <div className="max-w-2xl">
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
    <main>
      {/* Hero: foto de cidade com trilhas de luz e a camada azul pedida no manual da marca. */}
      <section className="relative overflow-hidden bg-profundo text-white">
        <Image src={cityNight} alt="" fill preload placeholder="blur" sizes="100vw" className="object-cover object-right" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-profundo via-profundo/90 to-profundo/45" />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 md:pb-28 md:pt-24">
          <h1 className="max-w-2xl text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] md:text-[4rem]">
            Infraestrutura inteligente para a sua empresa.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Infraestrutura de rede, segurança eletrônica e conectividade das marcas líderes, com pronta entrega em
            cinco unidades.
          </p>

          <form action="/catalogo" role="search" className="mt-10 max-w-xl">
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

          <p className="mt-5 text-sm leading-relaxed text-white/60">
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
      </section>

      <Wave top="text-profundo" bottom="bg-white" />

      {/* Parceiros */}
      <section aria-labelledby="parceiros" className="bg-white pb-20 pt-6">
        <div className="mx-auto max-w-6xl px-5">
          <h2 id="parceiros" className="text-center text-[15px] font-medium text-marinho/60">
            Parceira comercial de grandes marcas nacionais e internacionais
          </h2>
          <ul id="marcas" className="mt-10 grid grid-cols-2 items-center gap-x-10 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
            {partners.map((p) => (
              <li key={p.name} className="flex justify-center">
                <Image src={p.logo} alt={p.name} width={p.w} height={p.h} className="h-10 w-32 object-contain" />
              </li>
            ))}
          </ul>
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
          <ul className="mt-12 grid grid-cols-2 border-l border-t border-profundo/10 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.slug} className="border-b border-r border-profundo/10">
                <Link
                  href={`/catalogo/${c.slug}`}
                  className="group flex h-full items-center gap-4 px-5 py-6 transition-colors hover:bg-offwhite"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-royal/8 text-royal transition-colors group-hover:bg-profundo group-hover:text-white">
                    <span className="icon">{c.icon}</span>
                  </span>
                  <span className="font-medium text-profundo">{c.name}</span>
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
          <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
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
          <SectionHeading
            title="Logística eficiente e ágil"
            text="Logística própria e parcerias estratégicas: entregamos onde e quando você precisa."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <figure className="rounded-2xl bg-offwhite p-6">
              <Image
                src="/ref/mapa-brasil.png"
                alt="Mapa do Brasil: presença nacional, entregas em todo o Brasil"
                width={2001}
                height={2001}
                sizes="(min-width: 768px) 520px, 100vw"
                className="mx-auto w-full max-w-md"
              />
            </figure>
            <figure className="rounded-2xl bg-offwhite p-6">
              <Image
                src="/ref/mapa-spmg.png"
                alt="Mapa de SP e MG com as unidades de Bauru, Campinas, São Paulo, Jacareí e Minas Gerais: pronta entrega nas 5 unidades"
                width={2001}
                height={2001}
                sizes="(min-width: 768px) 520px, 100vw"
                className="mx-auto w-full max-w-md"
              />
            </figure>
          </div>
          <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {units.map((u) => (
              <li key={u.city} className="flex flex-col border-t-2 border-profundo pt-5">
                <p className="font-semibold text-profundo">
                  {u.city}
                  {u.note && <span className="ml-2 text-xs font-medium text-royal">{u.note}</span>}
                </p>
                <address className="mt-2 flex-1 text-sm not-italic leading-relaxed text-marinho/60">{u.address}</address>
                <a href={telHref(u.phone)} className="mt-4 text-sm font-semibold text-profundo hover:text-royal">
                  {u.phone}
                </a>
                <a
                  href={mapsHref(u.address)}
                  target="_blank"
                  rel="noopener"
                  className="mt-1 text-sm text-royal underline-offset-4 hover:underline"
                >
                  Ver no mapa
                </a>
              </li>
            ))}
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
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {customProjects.map((p) => (
              <li key={p.partner} className="relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl p-8">
                <Image src={p.image} alt="" fill sizes="(min-width: 768px) 560px, 100vw" className="-z-20 object-cover" />
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

      {/* Orçamento: é sequência real, por isso numerada. */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 px-5">
          <SectionHeading
            title="Orçamento sem cadastro, direto no WhatsApp"
            text="Sem carrinho e sem login. Você monta a lista no site e conversa com quem vai atender o seu pedido."
          />
          <ol className="grid gap-px overflow-hidden rounded-2xl bg-profundo/10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="bg-offwhite p-6">
                <span className="text-sm font-semibold text-royal">{i + 1}</span>
                <h3 className="mt-6 text-lg font-semibold text-profundo">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marinho/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Depoimentos reais publicados na loja */}
      <section className="border-t border-profundo/10 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading title="O que dizem nossos clientes" />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <li key={t.name}>
                <figure className="flex h-full flex-col rounded-2xl border border-profundo/10 p-8">
                  <blockquote className="flex-1 text-lg leading-relaxed text-marinho/85">“{t.text}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Image src={t.photo} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
                    <span className="font-semibold text-profundo">{t.name}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Chamada final */}
      <section className="bg-white pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden rounded-3xl bg-profundo px-8 py-12 text-white md:px-14 md:py-16">
            <div className="pointer-events-none absolute -right-40 -top-40 hidden size-[30rem] md:block">
              <SignalArcs />
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
