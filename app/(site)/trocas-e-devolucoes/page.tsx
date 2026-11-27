import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trocas e devoluções | Qualilan",
  description: "Prazos e condições para trocar ou devolver produtos comprados na Qualilan.",
};

// shortcut: rascunho baseado em loja.qualilan.com.br/politicas-de-devolucao; revisar com a Qualilan antes de publicar.
export default function ReturnsPage() {
  return (
    <LegalPage title="Trocas e devoluções">
      <h2>Desistência em até 7 dias</h2>
      <p>
        Para compras feitas a distância (por WhatsApp, telefone ou e-mail), você pode desistir em até 7 dias corridos
        após o recebimento, conforme o artigo 49 do Código de Defesa do Consumidor.
      </p>

      <h2>Condições para troca ou devolução</h2>
      <ul>
        <li>Produto sem uso e sem sinais de instalação.</li>
        <li>Na embalagem original, com manual, acessórios e a nota fiscal.</li>
        <li>Avarias de transporte precisam ser avisadas em até 48 horas após o recebimento, com fotos.</li>
      </ul>

      <h2>Como pedir</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Fale com a gente pelo{" "}
          <a href={whatsappLink("Olá, Qualilan! Preciso de ajuda com uma troca ou devolução.")}>WhatsApp</a>, pela
          Central SAC {site.sac} ou pelo e-mail <a href={`mailto:${site.email}`}>{site.email}</a>, informando o número da
          nota fiscal.
        </li>
        <li>Enviamos as instruções e o código para postar o produto de volta.</li>
        <li>Quando o produto chega, nossa equipe faz a análise. Aprovada, seguimos com a troca ou o reembolso.</li>
      </ol>

      <h2>Produto com defeito</h2>
      <p>
        Dentro da garantia, entre em contato pelos mesmos canais. Dependendo do fabricante, a análise pode ser feita
        pela assistência técnica autorizada da marca, e orientamos você em cada etapa.
      </p>
    </LegalPage>
  );
}
