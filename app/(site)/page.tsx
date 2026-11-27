import Link from "next/link";
import { Wave } from "@/components/wave";
import { brands, categories, mapsHref, segments, telHref, units, whatsappLink } from "@/lib/site";

const quoteMessage = "Olá, Qualilan! Gostaria de um orçamento.";

// Os arcos do "Q" da marca, abertos como ondas de sinal. É o único elemento ousado da página.
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

const facts = [
  { icon: "inventory_2", text: "Pronta entrega" },
  { icon: "location_on", text: "5 unidades em SP e MG" },
  { icon: "check", text: "Mais de 25 anos no mercado" },
];

const steps = [
  { icon: "search", title: "Encontre os produtos", text: "Busque por nome, marca ou código no catálogo." },
  { icon: "playlist_add", title: "Monte sua lista", text: "Adicione os itens e as quantidades de que precisa." },
  { icon: "chat", title: "Envie pelo WhatsApp", text: "A mensagem vai pronta para o nosso time de vendas." },
];

function SectionHeading({ title, text }: { title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem] md:leading-[1.1]">{title}</h2>
      {text && <p className="mt-4 text-[17px] leading-relaxed text-marinho/65">{text}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero: a busca é o trabalho principal de quem chega aqui. */}
      <section className="relative overflow-hidden bg-profundo text-white">
        <div className="pointer-events-none absolute right-[-22rem] top-1/2 hidden h-[52rem] w-[52rem] -translate-y-1/2 md:block lg:right-[-12rem]">
          <SignalArcs />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 md:pb-28 md:pt-24">
          <h1 className="max-w-2xl text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] md:text-[4rem]">
            Infraestrutura de rede para sua empresa, com pronta entrega.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Cabeamento, fibra óptica, switches, CFTV e controle de acesso das marcas que o mercado confia.
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

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/75">
            {facts.map((f) => (
              <li key={f.text} className="flex items-center gap-2">
                <span className="icon text-lg! text-amarelo">{f.icon}</span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Wave top="text-profundo" bottom="bg-white" />

      {/* Categorias */}
      <section className="bg-white pb-24 pt-12 md:pb-32">
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

      {/* Como pedir orçamento: é sequência real, por isso numerada. */}
      <section className="bg-offwhite py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 px-5">
          <SectionHeading
            title="Orçamento sem cadastro, direto no WhatsApp"
            text="Sem carrinho, sem login. Você monta a lista no site e conversa com quem vai atender o seu pedido."
          />
          <ol className="grid gap-px overflow-hidden rounded-2xl bg-profundo/10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="bg-white p-6">
                <span className="text-sm font-semibold text-royal">{i + 1}</span>
                <h3 className="mt-6 text-lg font-semibold text-profundo">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marinho/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Segmentos e marcas */}
      <section id="segmentos" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading title="Tecnologia, conectividade e segurança para qualquer setor" />
          <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
            {segments.map((s) => (
              <li key={s.name} className="flex items-center gap-3 text-profundo">
                <span className="icon text-royal">{s.icon}</span>
                <span className="font-medium">{s.name}</span>
              </li>
            ))}
          </ul>

          <div id="marcas" className="mt-24 border-t border-profundo/10 pt-10">
            <h2 className="text-sm font-medium text-marinho/55">Distribuidor das marcas líderes</h2>
            <ul className="mt-6 flex flex-wrap gap-x-12 gap-y-5 text-xl font-semibold tracking-tight text-profundo/45">
              {brands.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Unidades */}
      <section id="unidades" className="border-t border-profundo/10 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            title="Cinco unidades para entregar rápido onde você está"
            text="Estoque próprio em São Paulo e Minas Gerais, com retirada ou entrega."
          />
          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
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

      {/* Chamada final */}
      <section className="bg-white pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden rounded-3xl bg-profundo px-8 py-12 text-white md:px-14 md:py-16">
            <div className="pointer-events-none absolute -right-40 -top-40 hidden size-[30rem] md:block">
              <SignalArcs />
            </div>
            <div className="relative max-w-xl">
              <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-4xl">Tem um projeto? Fale com quem entende de rede.</h2>
              <p className="mt-4 text-[17px] text-white/70">Atendimento consultivo para empresas de todos os portes.</p>
              <a
                href={whatsappLink(quoteMessage)}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-laranja px-6 py-3.5 font-semibold text-profundo transition-colors hover:bg-amarelo"
              >
                <span className="icon text-xl!">chat</span>
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
