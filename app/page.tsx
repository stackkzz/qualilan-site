import Image from "next/image";
import Link from "next/link";
import { CurrentYear } from "./current-year";
import { brands, categories, segments, site, units, whatsappLink } from "@/lib/site";

const nav = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Segmentos", href: "#segmentos" },
  { label: "Marcas", href: "#marcas" },
  { label: "Unidades", href: "#unidades" },
];

const quoteMessage = "Olá, Qualilan! Gostaria de um orçamento.";

// Curva tirada da perna do "Q": é o divisor de seções ("fluidez" do manual).
function Wave({ top, bottom, flip = false }: { top: string; bottom: string; flip?: boolean }) {
  return (
    <div aria-hidden className={bottom}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className={`block h-12 w-full md:h-20 ${top} ${flip ? "-scale-x-100" : ""}`}
      >
        <path d="M0 0H1440V22C1180 22 1060 88 820 88C560 88 430 40 0 52Z" fill="currentColor" />
      </svg>
    </div>
  );
}

function SignalArcs() {
  const rings = [
    { r: 70, w: 14, delay: 0 },
    { r: 150, w: 18, delay: 120 },
    { r: 240, w: 22, delay: 240 },
    { r: 340, w: 26, delay: 360 },
  ];
  return (
    <svg viewBox="0 0 800 800" aria-hidden className="h-full w-full">
      {rings.map(({ r, w, delay }) => (
        <circle
          key={r}
          className="signal-arc"
          style={{ animationDelay: `${delay}ms` }}
          cx="400"
          cy="400"
          r={r}
          fill="none"
          stroke="#312E7F"
          strokeWidth={w}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="72 28"
          transform="rotate(60 400 400)"
        />
      ))}
      <circle
        className="signal-arc"
        style={{ animationDelay: "480ms" }}
        cx="400"
        cy="400"
        r="390"
        fill="none"
        stroke="#FF9900"
        strokeWidth="2"
        pathLength={100}
        strokeDasharray="18 82"
        transform="rotate(-40 400 400)"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <header className="bg-profundo text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
          <Link href="/" aria-label="Qualilan, página inicial">
            <Image src="/brand/logo-branco.png" alt="Qualilan" width={160} height={55} preload className="w-32 sm:w-40" />
          </Link>
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex gap-8 text-[15px] text-white/80">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={whatsappLink(quoteMessage)}
            className="whitespace-nowrap rounded-full bg-laranja px-4 py-2.5 text-sm font-semibold text-profundo transition-colors hover:bg-amarelo sm:px-5"
          >
            <span className="sm:hidden">Orçamento</span>
            <span className="hidden sm:inline">Pedir orçamento</span>
          </a>
        </div>
      </header>

      <main>
        {/* Hero: a busca é o trabalho principal de quem chega aqui. */}
        <section className="relative overflow-hidden bg-profundo text-white">
          <div className="pointer-events-none absolute -right-48 top-1/2 h-[820px] w-[820px] -translate-y-1/2 opacity-90 md:-right-24">
            <SignalArcs />
          </div>
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 md:pb-24 md:pt-24">
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Tudo para a infraestrutura de rede da sua empresa, com pronta entrega.
            </h1>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/75">
              Há mais de 25 anos distribuímos cabeamento, fibra óptica, switches, CFTV e controle de
              acesso das marcas que o mercado confia.
            </p>

            <form action="/catalogo" role="search" className="mt-10 max-w-2xl">
              <label htmlFor="q" className="sr-only">
                Buscar no catálogo
              </label>
              <div className="flex items-center rounded-full bg-white p-1.5 pl-5 text-marinho shadow-[0_20px_60px_-20px_rgba(0,0,26,0.6)]">
                <span className="icon text-royal">search</span>
                <input
                  id="q"
                  name="q"
                  type="search"
                  placeholder="Produto, marca ou código"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-marinho/45"
                />
                <button
                  type="submit"
                  className="rounded-full bg-royal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-profundo"
                >
                  Buscar
                </button>
              </div>
            </form>

            <ul className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Categorias mais procuradas">
              {categories.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/catalogo/${c.slug}`}
                    className="inline-block rounded-full border border-white/20 px-4 py-1.5 text-white/80 transition-colors hover:border-white/60 hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Wave top="text-profundo" bottom="bg-offwhite" />

        {/* Categorias */}
        <section className="bg-offwhite pb-20 pt-10 md:pb-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-profundo md:text-4xl">
                Catálogo completo para o seu projeto
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-marinho/70">
                Do cabo ao rack, do switch à câmera. Monte sua lista e receba o orçamento pelo
                WhatsApp.
              </p>
              <Link
                href="/catalogo"
                className="mt-8 inline-block font-semibold text-royal underline decoration-laranja decoration-2 underline-offset-[6px] hover:text-profundo"
              >
                Ver todo o catálogo
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-profundo/10 sm:grid-cols-3">
              {categories.map((c) => (
                <li key={c.slug} className="bg-white">
                  <Link
                    href={`/catalogo/${c.slug}`}
                    className="group flex h-full flex-col gap-6 p-5 transition-colors hover:bg-profundo hover:text-white"
                  >
                    <span className="icon text-3xl! text-royal group-hover:text-amarelo">{c.icon}</span>
                    <span className="font-medium">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Segmentos */}
        <section id="segmentos" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-profundo md:text-4xl">
              Tecnologia, conectividade e segurança para qualquer setor
            </h2>
            <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
              {segments.map((s) => (
                <li key={s.name} className="flex items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-royal/20 text-royal">
                    <span className="icon">{s.icon}</span>
                  </span>
                  <span className="font-medium text-profundo">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Como pedir orçamento: é sequência real, por isso numerada. */}
        <section className="bg-offwhite py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl font-bold tracking-tight text-profundo md:text-4xl">
              Orçamento em três passos
            </h2>
            <ol className="mt-12 grid gap-10 md:grid-cols-3">
              {[
                { icon: "search", title: "Encontre os produtos", text: "Busque por nome, marca ou código no catálogo." },
                { icon: "playlist_add", title: "Monte sua lista", text: "Adicione os itens e as quantidades que precisa." },
                { icon: "chat", title: "Envie pelo WhatsApp", text: "A mensagem vai pronta para o nosso time de vendas." },
              ].map((step, i) => (
                <li key={step.title} className="relative border-t-2 border-profundo/15 pt-6">
                  <span className="absolute -top-px left-0 h-0.5 w-12 bg-laranja" aria-hidden />
                  <span className="text-sm font-semibold text-royal">Passo {i + 1}</span>
                  <h3 className="mt-2 text-xl font-bold text-profundo">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-marinho/70">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Marcas */}
        <section id="marcas" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-lg font-semibold text-marinho/60">Distribuidor das marcas líderes</h2>
            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-2xl font-black tracking-tight text-profundo/35">
              {brands.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </section>

        <Wave top="text-white" bottom="bg-profundo" flip />

        {/* Unidades + CTA final */}
        <section id="unidades" className="bg-profundo pb-20 pt-10 text-white md:pb-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                Cinco unidades para entregar rápido onde você está.
              </h2>
              <ul className="mt-10 grid grid-cols-2 gap-4 text-white/85">
                {units.map((u) => (
                  <li key={u} className="flex items-center gap-2">
                    <span className="icon text-xl! text-amarelo">location_on</span>
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-royal p-8 md:p-10">
              <p className="text-2xl font-bold leading-snug">Tem um projeto? Fale com quem entende de rede.</p>
              <p className="mt-3 text-white/75">Atendimento consultivo para empresas de todos os portes.</p>
              <a
                href={whatsappLink(quoteMessage)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-laranja px-6 py-3 font-semibold text-profundo transition-colors hover:bg-amarelo"
              >
                <span className="icon text-xl!">chat</span>
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-marinho text-sm text-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
          <Image src="/brand/logo-branco.png" alt="Qualilan" width={130} height={45} />
          <p>
            Qualilan, CNPJ {site.cnpj}. © <CurrentYear />
          </p>
          <div className="flex gap-6">
            <a href={site.instagram} className="hover:text-white">
              Instagram
            </a>
            <a href={whatsappLink(quoteMessage)} className="hover:text-white">
              WhatsApp {site.whatsappLabel}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
