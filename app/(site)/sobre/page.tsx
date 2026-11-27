import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { differentials, partners, segments, units, whatsappLink } from "@/lib/site";
import bgTech from "@/public/ref/bg-tech.jpeg";

export const metadata: Metadata = {
  title: "Quem somos | Qualilan",
  description:
    "Distribuidora de cabeamento estruturado, redes, CFTV e controle de acesso, com cinco unidades em SP e MG e atendimento consultivo.",
};

// Texto adaptado de loja.qualilan.com.br/quem-somos e do site institucional (nov/2026).
export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-profundo text-white">
        <Image src={bgTech} alt="" fill preload placeholder="blur" sizes="100vw" className="hero-photo object-cover object-right" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-profundo via-profundo/85 to-profundo/30" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <h1 className="max-w-3xl text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] md:text-[3.75rem]">
            Há 25 anos entregando performance em tecnologia corporativa.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">Uma história construída com confiança, parceria e inovação.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-5 py-20 md:grid-cols-[2fr_1fr] md:py-28">
        <div className="max-w-2xl space-y-5 text-[17px] leading-relaxed text-marinho/80">
          <p>
            A Qualilan é uma distribuidora reconhecida pelo atendimento, pelos preços competitivos e pela
            disponibilidade de materiais. Hoje é um dos principais fornecedores de sistemas de tecnologia da
            informação e cabeamento estruturado.
          </p>
          <p>
            Construímos relações duradouras com base em ética e transparência. Ao longo dos anos, somamos uma
            história de parcerias com fabricantes líderes e clientes de todos os portes.
          </p>
          <p>
            Nosso time se atualiza constantemente para acompanhar as inovações do mercado. Ouvimos cada cliente
            para entender a necessidade real do projeto e indicar a solução mais eficiente e econômica.
          </p>
          <div className="pt-4">
            <a
              href={whatsappLink("Olá, Qualilan! Gostaria de falar com um especialista.")}
              className="inline-flex items-center gap-2 rounded-lg bg-laranja px-6 py-3.5 text-base font-semibold text-profundo hover:bg-amarelo"
            >
              <span className="icon text-xl!">chat</span>
              Falar com um especialista
            </a>
          </div>
        </div>

        <dl className="space-y-8 border-l-2 border-profundo/10 pl-8">
          <div>
            <dt className="text-sm text-marinho/55">Unidades</dt>
            <dd className="mt-1 font-semibold text-profundo">{units.map((u) => u.city).join(", ")}</dd>
          </div>
          <div>
            <dt className="text-sm text-marinho/55">Setores atendidos</dt>
            <dd className="mt-1 font-semibold text-profundo">{segments.map((s) => s.name).join(", ")}</dd>
          </div>
          <div>
            <dt className="text-sm text-marinho/55">CNPJ</dt>
            <dd className="mt-1 font-semibold text-profundo">11.746.517/0001-40</dd>
          </div>
          <Link
            href="/catalogo"
            className="inline-block font-semibold text-royal underline decoration-laranja decoration-2 underline-offset-[6px]"
          >
            Ver o catálogo
          </Link>
        </dl>
      </section>

      <section className="bg-offwhite py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem]">O que nos diferencia</h2>
          <ul className="reveal mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {differentials.map((d) => (
              <li key={d.title}>
                <Image src={d.icon} alt="" width={56} height={56} className="size-14 object-contain" />
                <h3 className="mt-5 font-semibold leading-snug text-profundo">{d.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-marinho/65">{d.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-[15px] font-medium text-marinho/60">Parceira comercial de grandes marcas nacionais e internacionais</h2>
          <ul className="mt-10 grid grid-cols-2 items-center gap-10 sm:grid-cols-3 md:grid-cols-5">
            {partners.map((p) => (
              <li key={p.name} className="flex justify-center">
                <Image src={p.logo} alt={p.name} width={p.w} height={p.h} className="h-10 w-32 object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
