import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de uso | Qualilan",
  description: "Regras de uso do site e do catálogo da Qualilan.",
};

// shortcut: rascunho adaptado dos termos de loja.qualilan.com.br para um site sem venda online; precisa de revisão jurídica da Qualilan.
export default function TermsPage() {
  return (
    <LegalPage title="Termos de uso">
      <h2>Sobre este site</h2>
      <p>
        Este site é o catálogo da Qualilan Distribuidora. Ele apresenta os produtos com que trabalhamos e permite montar
        uma lista para pedir orçamento pelo WhatsApp. Não há venda, pagamento nem cadastro pelo site.
      </p>

      <h2>Produtos, preços e disponibilidade</h2>
      <ul>
        <li>O catálogo é informativo: preço, prazo e frete são passados pela nossa equipe no orçamento.</li>
        <li>A disponibilidade em estoque é confirmada no momento do orçamento e pode mudar sem aviso.</li>
        <li>As imagens são ilustrativas. Confira as especificações técnicas com a nossa equipe antes de fechar o pedido.</li>
      </ul>

      <h2>Orçamento pelo WhatsApp</h2>
      <p>
        Enviar a lista não gera compromisso de compra. O pedido só é fechado depois que você aprova o orçamento com a
        nossa equipe.
      </p>

      <h2>Marcas e conteúdo</h2>
      <p>
        Textos, fotos e a identidade visual da Qualilan não podem ser copiados sem autorização. Marcas e logotipos dos
        fabricantes pertencem aos seus donos e aparecem aqui porque somos distribuidores dos seus produtos.
      </p>

      <h2>Seus dados</h2>
      <p>
        O tratamento de dados pessoais segue a Lei Geral de Proteção de Dados. Veja os detalhes na{" "}
        <Link href="/privacidade">política de privacidade</Link>.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas sobre estes termos: <a href={`mailto:${site.email}`}>{site.email}</a> ou Central SAC {site.sac},{" "}
        {site.hours.toLowerCase()}.
      </p>
    </LegalPage>
  );
}
