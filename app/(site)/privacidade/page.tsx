import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidade | Qualilan",
  description: "Como o site da Qualilan trata os seus dados.",
};

// shortcut: rascunho escrito a partir do que o site faz hoje; precisa de revisão jurídica da Qualilan antes de publicar.
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 leading-relaxed text-marinho/80 md:py-24 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-profundo">
      <h1 className="text-3xl font-bold tracking-tight text-profundo md:text-4xl">Privacidade</h1>
      <p className="mt-4 text-sm text-marinho/50">Qualilan, CNPJ {site.cnpj}</p>

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
        <a href={`mailto:${site.email}`} className="text-royal underline underline-offset-4">
          {site.email}
        </a>
        .
      </p>

      <h2>Limpar a lista de orçamento</h2>
      <p>Abra a lista pelo botão “Orçamento” no topo e use “Limpar lista”, ou apague os dados do site no seu navegador.</p>
    </article>
  );
}
