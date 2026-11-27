"use client";

import { useActionState, useState } from "react";
import { getMyProfile } from "@/app/(site)/conta/actions";
import { sendQuoteRequest } from "@/app/(site)/pedido-actions";
import { useQuote } from "./quote-cart";
import { SpinnerRing } from "./qualilan-loader";

const input =
  "w-full rounded-lg border border-profundo/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/20";

// Alternativa ao WhatsApp para compradores que precisam de registro por e-mail (empresas, licitações).
export function EmailQuoteForm() {
  const { items } = useQuote();
  const [state, action, pending] = useActionState(sendQuoteRequest, undefined);
  // Dados de quem está logado, buscados só quando o formulário abre (visitante recebe tudo em branco).
  const [me, setMe] = useState<{ name: string; company: string; email: string; phone: string } | null>(null);

  if (state?.ok) {
    return (
      <div role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        Pedido enviado. Nossa equipe responde por e-mail no horário de atendimento.
      </div>
    );
  }

  return (
    <details
      className="group rounded-xl border border-profundo/10"
      onToggle={(e) => {
        if (e.currentTarget.open && !me) getMyProfile().then((p) => setMe(p ?? { name: "", company: "", email: "", phone: "" }));
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-profundo [&::-webkit-details-marker]:hidden">
        Prefere receber por e-mail?
        <span className="icon text-xl! transition-transform group-open:rotate-90">chevron_right</span>
      </summary>
      <form key={me?.email ? "conta" : "visitante"} action={action} className="space-y-3 px-4 pb-4">
        <input type="hidden" name="items" value={JSON.stringify(items.map(({ slug, name, sku, qty }) => ({ slug, name, sku, qty })))} />
        {/* Armadilha para robôs: invisível para pessoas */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <label className="block text-xs font-medium text-profundo">
          Nome
          <input name="name" required minLength={2} maxLength={120} autoComplete="name" defaultValue={me?.name} className={`mt-1 ${input}`} />
        </label>
        <label className="block text-xs font-medium text-profundo">
          Empresa
          <input name="company" maxLength={160} autoComplete="organization" defaultValue={me?.company} className={`mt-1 ${input}`} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-medium text-profundo">
            E-mail
            <input name="email" type="email" required maxLength={200} autoComplete="email" defaultValue={me?.email} className={`mt-1 ${input}`} />
          </label>
          <label className="block text-xs font-medium text-profundo">
            Telefone
            <input name="phone" type="tel" maxLength={40} autoComplete="tel" defaultValue={me?.phone} className={`mt-1 ${input}`} />
          </label>
        </div>
        <label className="block text-xs font-medium text-profundo">
          Observações <span className="font-normal text-marinho/50">(opcional)</span>
          <textarea name="message" rows={2} maxLength={2000} className={`mt-1 ${input}`} />
        </label>
        {state?.error && (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-profundo px-5 py-3 text-sm font-semibold text-white hover:bg-royal disabled:opacity-60"
        >
          {pending && <SpinnerRing />}
          {pending ? "Enviando…" : "Enviar pedido por e-mail"}
        </button>
      </form>
    </details>
  );
}
