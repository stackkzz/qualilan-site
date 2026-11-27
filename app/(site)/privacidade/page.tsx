import type { Metadata } from "next";
import Link from "next/link";
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

      <h2>Sem conta</h2>
      <p>
        Você pode montar a lista e pedir orçamento sem criar conta. A lista fica salva só no seu navegador, para não se
        perder entre uma visita e outra.
      </p>

      <h2>O que guardamos e para quê</h2>
      <ul>
        <li>
          <strong>Pedido de orçamento por e-mail:</strong> nome, empresa, e-mail, telefone, observações e os itens da
          lista. Usamos para responder ao pedido e acompanhar a negociação.
        </li>
        <li>
          <strong>Conta de cliente (opcional):</strong> e-mail e senha (guardada cifrada; nem a nossa equipe consegue
          vê-la), nome, CPF ou CNPJ, razão social, inscrição estadual, celular, endereço, se quer receber novidades e o
          histórico dos orçamentos enviados pelo site, pelo WhatsApp ou por e-mail. Usamos para preencher seus pedidos,
          mostrar o histórico e permitir pedir de novo.
        </li>
        <li>
          <strong>Estatísticas de uso:</strong> quais produtos são vistos e adicionados à lista, sem nome, e-mail ou
          qualquer dado que identifique você. Servem para melhorar o catálogo.
        </li>
        <li>
          <strong>Pedido pelo WhatsApp:</strong> a conversa acontece no WhatsApp, e os dados que você enviar lá são usados
          só para responder ao pedido.
        </li>
      </ul>

      <h2>Onde ficam e com quem compartilhamos</h2>
      <p>
        Os dados ficam em serviços de nuvem contratados pela Qualilan: Supabase (banco de dados e login), Vercel
        (hospedagem do site) e Resend (aviso de novo pedido para a nossa equipe). Ao digitar o CEP, o endereço é buscado no
        ViaCEP; ao digitar o CNPJ, a razão social é buscada na BrasilAPI. Não vendemos nem cedemos seus dados para
        publicidade.
      </p>

      <h2>Por quanto tempo</h2>
      <p>
        {/* shortcut: prazos sugeridos; a Qualilan precisa confirmar com o jurídico/contábil. */}
        Os dados da conta ficam guardados enquanto ela existir. Ao excluir a conta, o perfil é apagado na hora; os pedidos
        de orçamento já enviados ficam sem vínculo com você e são guardados por até 5 anos, por obrigação comercial e
        fiscal.
      </p>

      <h2>Excluir a conta</h2>
      <p>
        Em <Link href="/conta/dados">Minha conta, Meus dados</Link>, use “Excluir minha conta”. Você também pode pedir pelo
        e-mail abaixo.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Pela Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir a qualquer momento uma cópia dos dados que
        temos, corrigi-los ou apagá-los. Escreva para{" "}
        <a href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>

      <h2>Encarregado de dados (DPO)</h2>
      <p>
        {/* shortcut: nome do encarregado ainda não informado pela Qualilan; trocar quando definido. */}
        O contato do encarregado pelo tratamento de dados pessoais é o e-mail{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>, com o assunto “LGPD”.
      </p>

      <h2>Limpar a lista de orçamento</h2>
      <p>Abra a lista pelo botão “Orçamento” no topo e use “Limpar lista”, ou apague os dados do site no seu navegador.</p>
    </LegalPage>
  );
}
