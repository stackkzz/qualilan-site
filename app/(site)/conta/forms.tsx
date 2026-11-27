"use client";

import { useActionState } from "react";
import { SpinnerRing } from "@/components/qualilan-loader";
import { useQuote } from "@/components/quote-cart";
import { saveProfile, sendLoginLink } from "./actions";

const input =
  "mt-1 w-full rounded-lg border border-profundo/20 bg-white px-3 py-2.5 text-[15px] text-marinho outline-none focus:border-royal focus:ring-2 focus:ring-royal/20";
const primary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-profundo px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-royal disabled:opacity-60";

export function LoginLinkForm() {
  const [state, action, pending] = useActionState(sendLoginLink, undefined);
  if (state?.ok) {
    return (
      <div role="status" className="rounded-xl bg-emerald-50 p-5 text-emerald-900">
        <p className="flex items-center gap-2 font-semibold">
          <span className="icon icon-fill text-xl!">mark_email_read</span>
          Link enviado para {state.message}
        </p>
        <p className="mt-2 text-sm">
          Abra o e-mail neste mesmo aparelho e toque em “Entrar”. Se não chegar em alguns minutos, confira a caixa de spam.
        </p>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm font-medium text-profundo">
        Seu e-mail
        <input name="email" type="email" required autoComplete="email" placeholder="nome@empresa.com.br" className={input} />
      </label>
      {state?.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${primary} w-full`}>
        {pending && <SpinnerRing />}
        {pending ? "Enviando…" : "Receber link de acesso"}
      </button>
      <p className="text-xs text-marinho/55">Sem senha: mandamos um link de acesso para o seu e-mail. Primeira vez? A conta é criada na hora.</p>
    </form>
  );
}

type Profile = { name: string; company: string; cnpj: string; phone: string };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(saveProfile, undefined);
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-profundo">
          Nome
          <input name="name" defaultValue={profile.name} maxLength={120} autoComplete="name" className={input} />
        </label>
        <label className="block text-sm font-medium text-profundo">
          Empresa
          <input name="company" defaultValue={profile.company} maxLength={160} autoComplete="organization" className={input} />
        </label>
        <label className="block text-sm font-medium text-profundo">
          CNPJ
          <input name="cnpj" defaultValue={profile.cnpj} maxLength={20} inputMode="numeric" className={input} />
        </label>
        <label className="block text-sm font-medium text-profundo">
          Telefone ou WhatsApp
          <input name="phone" type="tel" defaultValue={profile.phone} maxLength={40} autoComplete="tel" className={input} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={primary}>
          {pending && <SpinnerRing />}
          {pending ? "Salvando…" : "Salvar dados"}
        </button>
        {state?.ok && !pending && <span role="status" className="text-sm text-emerald-700">Dados salvos.</span>}
        {state?.error && (
          <span role="alert" className="text-sm text-red-700">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}

type Item = { slug: string; name: string; sku: string | null; qty: number };

// "Pedir de novo": põe os itens de um orçamento antigo na lista atual (soma às quantidades que já estão lá).
export function ReorderButton({ items }: { items: Item[] }) {
  const { add, setQty, items: current, open } = useQuote();
  return (
    <button
      type="button"
      onClick={() => {
        for (const i of items) {
          const existing = current.find((c) => c.slug === i.slug);
          if (existing) setQty(i.slug, existing.qty + i.qty);
          else {
            add({ slug: i.slug, name: i.name, sku: i.sku });
            if (i.qty > 1) setQty(i.slug, i.qty);
          }
        }
        open();
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-profundo/15 px-3 py-2 text-sm font-semibold text-profundo hover:border-profundo"
    >
      <span className="icon text-lg!">replay</span>
      Pedir de novo
    </button>
  );
}
