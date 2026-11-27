import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconTile } from "@/components/icon-tile";
import { WhatsAppIcon, whatsappButtonClass } from "@/components/whatsapp-icon";
import { googleRating, site, whatsappLink } from "@/lib/site";
import nextBusiness from "@/public/ref/instagram/next-business.jpg";
import smartfast from "@/public/ref/instagram/capacitacao-smartfast.jpg";

export const metadata: Metadata = {
  title: "Quem somos | Qualilan",
  description:
    "Desde 2001 distribuindo soluções de infraestrutura de rede, data center, segurança eletrônica e elétrica. Cinco unidades com pronta entrega em SP e MG.",
};

// Fontes: LinkedIn da Qualilan (fundação, missão, "Top 5", áreas), loja.qualilan.com.br/quem-somos e Instagram @grupo.qualilan.
const facts = [
  { value: "2001", label: "Ano de fundação" },
  { value: "Top 5", label: "Entre os distribuidores de cabeamento estruturado do Brasil" },
  { value: "5", label: "Unidades com pronta entrega em SP e MG" },
  { value: googleRating.score, label: `No Google, com ${googleRating.count} avaliações` },
];

const areas = [
  { icon: "settings_ethernet", title: "Infraestrutura de rede e conectividade", text: "Cabeamento estruturado, fibra óptica, switches e wireless.", href: "/catalogo/cabos-lan" },
  { icon: "dns", title: "Data center", text: "Soluções para salas técnicas, racks e conectividade de alta densidade.", href: "/catalogo/rede-optica" },
  { icon: "videocam", title: "Segurança eletrônica", text: "CFTV e controle de acesso, do projeto à capacitação da equipe.", href: "/catalogo/cftv" },
  { icon: "electrical_services", title: "Elétrica", text: "Cabos, canaletas e acabamento para instalações organizadas e seguras.", href: "/catalogo/cabos-eletricos" },
];

const sustainability = [
  { title: "GigaLAN Green, da Lightera", text: "Cabeamento estruturado com proposta mais sustentável, para projetos que olham para o impacto ambiental." },
  { title: "Programa Green IT", text: "Projeto de tecnologia e sustentabilidade com a Unimed Araraquara, um dos nossos cases." },
  { title: "Redes ópticas Laserway", text: "Redes 100% ópticas que reduzem o uso de plástico e o consumo de energia." },
];

export default function AboutPage() {
  return (
    <main className="overflow-x-clip bg-white">
      {/* Hero dividido: texto e foto real da equipe */}
      <section className="relative overflow-hidden bg-profundo text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="hero-title text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] md:text-[3.5rem]">
              Há 25 anos conectando empresas à tecnologia certa.
            </h1>
            <p style={{ "--i": 1 } as React.CSSProperties} className="hero-in mt-6 max-w-lg text-lg leading-relaxed text-white/75">
              Distribuidora de soluções de valor agregado em infraestrutura de rede, data center, segurança eletrônica e
              elétrica, com time técnico especializado.
            </p>
          </div>
          <figure style={{ "--i": 2 } as React.CSSProperties} className="hero-in relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image src={nextBusiness} alt="Equipe Qualilan no evento Next Business Bauru 2026" fill preload placeholder="blur" sizes="(min-width: 1024px) 480px, 100vw" className="object-cover object-top" />
            </div>
            <figcaption className="absolute -bottom-5 left-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-profundo shadow-lg">
              <span className="icon icon-fill text-lg! text-laranja">event</span>
              Next Business Bauru 2026
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Fatos */}
      <section className="border-b border-profundo/10">
        <dl className="reveal mx-auto grid max-w-6xl grid-cols-2 px-5 lg:grid-cols-4">
          {facts.map((f, i) => (
            <div key={f.label} className={`py-10 pr-6 ${i > 0 ? "lg:border-l lg:border-profundo/10 lg:pl-8" : ""} ${i % 2 === 1 ? "border-l border-profundo/10 pl-6 lg:pl-8" : ""}`}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="text-4xl font-bold tracking-tight text-profundo md:text-5xl">{f.value}</dd>
              <dd className="mt-2 max-w-[14rem] text-sm leading-snug text-marinho/60">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Quem somos + missão */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="max-w-xl space-y-5 text-[17px] leading-relaxed text-marinho/80">
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem]">Quem somos</h2>
            <p>
              A Qualilan é reconhecida pelo atendimento, pelos preços competitivos e pela disponibilidade de materiais.
              Atuamos na distribuição de soluções de tecnologia da informação e cabeamento estruturado para empresas de
              todos os portes.
            </p>
            <p>
              Construímos relações duradouras com base em ética e transparência, ao lado de fabricantes líderes. Nosso
              time se atualiza constantemente e ouve cada cliente para indicar a solução mais eficiente e econômica para o
              projeto.
            </p>
          </div>
          <blockquote className="reveal-title relative overflow-hidden rounded-3xl bg-offwhite p-10 md:p-14">
            <Image src="/brand/q-azul.png" alt="" width={1204} height={1244} aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 w-72 opacity-[0.07]" />
            <p className="relative text-sm font-semibold text-royal">Nossa missão</p>
            <p className="relative mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] text-profundo md:text-4xl">
              Apoiar parceiros na conquista de novos negócios.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Áreas de atuação */}
      <section className="bg-offwhite py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="reveal-title max-w-2xl text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem]">
            Um ecossistema integrado para o seu projeto
          </h2>
          <ul className="reveal mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a) => (
              <li key={a.title}>
                <Link href={a.href} className="lift group flex h-full flex-col rounded-2xl bg-white p-6">
                  <IconTile icon={a.icon} />
                  <h3 className="mt-5 font-semibold leading-snug text-profundo">{a.title}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-marinho/65">{a.text}</p>
                  <span className="mt-5 text-sm font-semibold text-royal group-hover:underline">Ver no catálogo</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Por dentro: eventos e treinamentos do Instagram */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="reveal-title max-w-2xl text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem]">
            Por dentro da Qualilan
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-marinho/65">
            Eventos, treinamentos e capacitações que aproximam fabricantes, integradores e clientes.
          </p>
          <div className="reveal mt-12 grid gap-5 lg:grid-cols-3">
            {/* A foto do evento já está no topo da página; aqui o card é só texto para não repetir a imagem */}
            <article className="relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl bg-profundo p-8 text-white lg:col-span-2">
              <span aria-hidden className="icon absolute right-8 top-8 -z-10 text-[9rem]! leading-none text-white/10">event</span>
              <p className="text-sm font-semibold text-amarelo">Evento, novembro de 2026</p>
              <h3 className="mt-2 text-2xl font-bold">Next Business Bauru</h3>
              <p className="mt-2 max-w-lg text-white/80">
                Uma imersão no futuro da tecnologia e da segurança, com parceiros e clientes, sobre como otimizar a
                infraestrutura das empresas.
              </p>
            </article>
            <article className="flex flex-col overflow-hidden rounded-3xl border border-profundo/10">
              <div className="relative aspect-[16/10]">
                <Image src={smartfast} alt="Equipe da SmartFast na capacitação Control iD" fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover object-bottom" />
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-royal">Capacitação, setembro de 2026</p>
                <h3 className="mt-2 text-lg font-bold text-profundo">Control iD com a SmartFast</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marinho/65">
                  Treinamento mão na massa para a equipe técnica instalar, configurar e manter os produtos de um grande
                  projeto.
                </p>
              </div>
            </article>
            <article className="flex gap-5 rounded-3xl bg-offwhite p-6 lg:col-span-2">
              <IconTile icon="groups" size="lg" />
              <div>
                <p className="text-sm font-semibold text-royal">Treinamento, setembro de 2026</p>
                <h3 className="mt-1 text-lg font-bold text-profundo">Controle de acesso para condomínios</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marinho/65">
                  Em Bauru, com a Control iD: reconhecimento facial, registro de visitantes e gestão de acessos pensados
                  para a rotina do condomínio de um cliente.
                </p>
              </div>
            </article>
            <article className="flex gap-5 rounded-3xl bg-offwhite p-6">
              <IconTile icon="school" size="lg" />
              <div>
                <h3 className="text-lg font-bold text-profundo">Conteúdo técnico</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marinho/65">
                  Dicas de especificação no Instagram: fibra monomodo ou multimodo, a câmera certa para cada ambiente e mais.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Sustentabilidade */}
      <section className="bg-profundo py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#7DDB8E]">
              <span className="icon icon-fill text-3xl!">eco</span>
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem] md:leading-[1.1]">
              Tecnologia com responsabilidade
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/70">
              Infraestrutura de rede também pode ser uma escolha mais consciente.
            </p>
          </div>
          <ul className="reveal space-y-px overflow-hidden rounded-2xl bg-white/10">
            {sustainability.map((s) => (
              <li key={s.title} className="bg-profundo p-6 md:p-8">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-white/70">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Redes e contato */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
          <div className="rounded-3xl border border-profundo/10 p-8 md:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-profundo">Acompanhe a Qualilan</h2>
            <p className="mt-3 text-marinho/65">Lançamentos, eventos e dicas técnicas no Instagram e no LinkedIn.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {site.socials
                .filter((s) => s.label === "Instagram" || s.label === "LinkedIn")
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center rounded-full border-2 border-profundo/15 px-5 py-2.5 font-semibold text-profundo transition-colors hover:border-profundo"
                  >
                    {s.label}
                  </a>
                ))}
            </div>
          </div>
          <div className="rounded-3xl bg-offwhite p-8 md:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-profundo">Vamos conversar sobre o seu projeto</h2>
            <p className="mt-3 text-marinho/65">Atendimento: {site.hours.toLowerCase()}.</p>
            <a href={whatsappLink("Olá, Qualilan! Gostaria de falar com um especialista.")} className={`mt-6 ${whatsappButtonClass}`}>
              <WhatsAppIcon />
              Falar com um especialista
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
