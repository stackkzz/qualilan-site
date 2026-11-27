import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidade | Qualilan",
  description: "Como o site da Qualilan trata os seus dados.",
};

// shortcut: rascunho escrito a partir do que o site faz hoje; precisa de revisão jurídica da Qualilan antes de publicar.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacidade">

      <h2>O que guardamos</h2>
      <p>
        Este site não tem cadastro nem login de clientes. A lista de orçamento que você monta fica salva apenas no
        seu navegador, para não se perder entre uma visita e outra. Ela não é enviada para os nossos servidores.
      </p>

      <h2>Quando você pede um orçamento</h2>
      <p>
        Ao clicar em “Enviar pelo WhatsApp”, o site abre o WhatsApp com a lista pronta. A partir daí, a conversa
        acontece no WhatsApp, e os dados que você enviar (nome, empresa, itens) são usados só para responder ao seu
        pedido e acompanhar a negociação.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Pela Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir a qualquer momento para saber quais
        dados seus temos, corrigi-los ou apagá-los. Escreva para{" "}
        <a href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>

      <h2>Limpar a lista de orçamento</h2>
      <p>Abra a lista pelo botão “Orçamento” no topo e use “Limpar lista”, ou apague os dados do site no seu navegador.</p>
    </LegalPage>
  );
}
