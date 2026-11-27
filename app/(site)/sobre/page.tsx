import type { Metadata } from "next";
import Link from "next/link";
import { brands, segments, units, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quem somos | Qualilan",
  description:
    "Distribuidora de cabeamento estruturado, redes, CFTV e controle de acesso, com cinco unidades em SP e MG e atendimento consultivo.",
};

// Texto adaptado de loja.qualilan.com.br/quem-somos e do site institucional (nov/2026).
export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-profundo text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Mais de 25 anos conectando empresas à tecnologia certa.
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[2fr_1fr] md:py-24">
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-marinho/80">
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
          <a
            href={whatsappLink("Olá, Qualilan! Gostaria de falar com um especialista.")}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-laranja px-6 py-3 text-base font-semibold text-profundo hover:bg-amarelo"
          >
            <span className="icon text-xl!">chat</span>
            Falar com um especialista
          </a>
        </div>

        <dl className="space-y-8 border-l-2 border-profundo/10 pl-8">
          <div>
            <dt className="text-sm text-marinho/60">Unidades</dt>
            <dd className="mt-1 font-semibold text-profundo">{units.map((u) => u.city).join(", ")}</dd>
          </div>
          <div>
            <dt className="text-sm text-marinho/60">Setores atendidos</dt>
            <dd className="mt-1 font-semibold text-profundo">{segments.map((s) => s.name).join(", ")}</dd>
          </div>
          <div>
            <dt className="text-sm text-marinho/60">Marcas</dt>
            <dd className="mt-1 font-semibold text-profundo">{brands.join(", ")}</dd>
          </div>
          <Link href="/catalogo" className="inline-block font-semibold text-royal underline decoration-laranja decoration-2 underline-offset-[6px]">
            Ver o catálogo
          </Link>
        </dl>
      </section>
    </div>
  );
}
