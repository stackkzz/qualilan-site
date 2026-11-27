import Link from "next/link";
import { Wave } from "@/components/wave";
import { brands, categories, mapsHref, segments, telHref, units, whatsappLink } from "@/lib/site";

const quoteMessage = "Olá, Qualilan! Gostaria de um orçamento.";

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
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-12 md:grid-cols-2 md:items-end">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                Cinco unidades para entregar rápido onde você está.
              </h2>
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
            <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
              {units.map((u) => (
                <li key={u.city} className="flex flex-col bg-profundo p-5 sm:last:col-span-2 lg:last:col-span-1">
                  <p className="flex items-center gap-2 font-semibold">
                    <span className="icon text-xl! text-amarelo">location_on</span>
                    {u.city}
                    {u.note && <span className="text-xs font-normal text-white/50">{u.note}</span>}
                  </p>
                  <address className="mt-3 flex-1 text-sm not-italic leading-relaxed text-white/70">{u.address}</address>
                  <a href={telHref(u.phone)} className="mt-4 font-medium hover:text-amarelo">
                    {u.phone}
                  </a>
                  <a
                    href={mapsHref(u.address)}
                    target="_blank"
                    rel="noopener"
                    className="mt-1 text-sm text-white/60 underline underline-offset-4 hover:text-white"
                  >
                    Ver no mapa
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

    </>
  );
}
