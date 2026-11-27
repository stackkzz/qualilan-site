import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site, units } from "@/lib/site";

export const metadata: Metadata = {
  title: "Envio e entrega | Qualilan",
  description: "Como funcionam prazo, frete e entrega dos pedidos da Qualilan.",
};

// shortcut: rascunho baseado em loja.qualilan.com.br/politicas-de-envio, adaptado para pedidos fechados por orçamento; revisar com a Qualilan.
export default function ShippingPage() {
  return (
    <LegalPage title="Envio e entrega">
      <h2>Prazo e frete</h2>
      <p>
        Prazo e valor do frete são informados no orçamento, de acordo com o endereço de entrega, o volume do pedido e a
        unidade que vai atender você. Com {units.length} unidades em SP e MG, muitos itens saem com pronta entrega.
      </p>
      <p>
        O prazo combinado é uma estimativa. Em períodos de alta demanda, como Black Friday e fim de ano, ele pode aumentar.
      </p>

      <h2>No recebimento</h2>
      <ul>
        <li>Confira o volume e a embalagem antes de assinar o comprovante de entrega.</li>
        <li>
          Se houver avaria causada pelo transporte, recuse o volume ou avise a gente em até 48 horas, com fotos.
        </li>
        <li>Se a entrega for recusada ou o endereço estiver errado, o custo de um novo envio fica com o cliente.</li>
      </ul>

      <h2>Atrasos fora do nosso controle</h2>
      <p>
        Retenções em fiscalização (SEFAZ), greves, bloqueios de estrada, condições climáticas e problemas da
        transportadora podem atrasar a entrega. Nesses casos, avisamos assim que soubermos e ajudamos a resolver. A
        regularização de retenção fiscal depende do cliente quando envolve dados dele.
      </p>

      <h2>Dúvidas sobre um pedido</h2>
      <p>
        Fale com a Central SAC pelo {site.sac} ou pelo e-mail <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
