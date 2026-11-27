"use client";

import Link from "next/link";
import { type FormEvent, startTransition, useActionState, useState } from "react";
import { SpinnerRing } from "@/components/qualilan-loader";
import { useQuote } from "@/components/quote-cart";
import { requestPasswordReset, saveProfile, signInCustomer, signUpCustomer, updatePassword } from "./actions";

const input =
  "mt-1 w-full rounded-lg border border-profundo/20 bg-white px-3 py-2.5 text-[15px] text-marinho outline-none focus:border-royal focus:ring-2 focus:ring-royal/20";
const label = "block text-sm font-medium text-profundo";
const primary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-profundo px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-royal disabled:opacity-60";
const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

// O React limpa o formulário após uma action; enviando assim, os campos ficam preenchidos quando há erro.
function keepValues(action: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  };
}

function Errors({ error }: { error?: string }) {
  return error ? (
    <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
      {error}
    </p>
  ) : null;
}

function Submit({ pending, idle, busy, full }: { pending: boolean; idle: string; busy: string; full?: boolean }) {
  return (
    <button type="submit" disabled={pending} className={`${primary} ${full ? "w-full" : ""}`}>
      {pending && <SpinnerRing />}
      {pending ? busy : idle}
    </button>
  );
}

export function SignInForm() {
  const [state, action, pending] = useActionState(signInCustomer, undefined);
  return (
    <form onSubmit={keepValues(action)} className="space-y-4">
      <label className={label}>
        E-mail
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className={label}>
        Senha
        <input name="password" type="password" required autoComplete="current-password" className={input} />
      </label>
      <Errors error={state?.error} />
      <Submit pending={pending} idle="Entrar" busy="Entrando…" full />
      <Link href="/conta/esqueci" className="block text-center text-sm font-semibold text-royal hover:underline">
        Esqueceu a sua senha?
      </Link>
    </form>
  );
}

export type ProfileValues = {
  person_type: "pf" | "pj";
  name: string;
  last_name: string;
  company: string;
  doc: string;
  rg_ie: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  newsletter: boolean;
};

export const emptyProfile: ProfileValues = {
  person_type: "pf",
  name: "",
  last_name: "",
  company: "",
  doc: "",
  rg_ie: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  newsletter: false,
};

// Campos do cadastro (iguais aos da loja antiga), usados em "Criar conta" e em "Meus dados".
function ProfileFields({ initial }: { initial: ProfileValues }) {
  const [type, setType] = useState(initial.person_type);
  const [addr, setAddr] = useState({ street: initial.street, district: initial.district, city: initial.city, state: initial.state });

  // CEP preenche o endereço (ViaCEP, serviço público dos Correios); se falhar, a pessoa digita.
  async function fillFromCep(cep: string) {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const d = await r.json();
      if (!d.erro) setAddr({ street: d.logradouro ?? "", district: d.bairro ?? "", city: d.localidade ?? "", state: d.uf ?? "" });
    } catch {}
  }

  return (
    <div className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="mb-3 text-sm font-semibold text-profundo">Informações pessoais</legend>
        <div className="flex gap-5" role="radiogroup">
          {(["pf", "pj"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm">
              <input type="radio" name="person_type" value={t} checked={type === t} onChange={() => setType(t)} className="size-4 accent-royal" />
              {t === "pf" ? "Pessoa física" : "Pessoa jurídica"}
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>
            Nome
            <input name="name" required minLength={2} maxLength={120} autoComplete="given-name" defaultValue={initial.name} className={input} />
          </label>
          <label className={label}>
            Sobrenome
            <input name="last_name" maxLength={120} autoComplete="family-name" defaultValue={initial.last_name} className={input} />
          </label>
          {type === "pj" && (
            <label className={`${label} sm:col-span-2`}>
              Razão social
              <input name="company" required maxLength={160} autoComplete="organization" defaultValue={initial.company} className={input} />
            </label>
          )}
          <label className={label}>
            {type === "pf" ? "CPF" : "CNPJ"}
            <input
              key={type}
              name="doc"
              required
              inputMode="numeric"
              maxLength={type === "pf" ? 14 : 18}
              placeholder={type === "pf" ? "000.000.000-00" : "00.000.000/0000-00"}
              defaultValue={type === initial.person_type ? initial.doc : ""}
              className={input}
            />
          </label>
          <label className={label}>
            {type === "pf" ? "RG" : "Inscrição estadual"}
            <input name="rg_ie" maxLength={30} defaultValue={initial.rg_ie} className={input} />
          </label>
          <label className={label}>
            Celular
            <input name="phone" type="tel" maxLength={40} autoComplete="tel" defaultValue={initial.phone} placeholder="(14) 99999-9999" className={input} />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-3 text-sm font-semibold text-profundo">
          Endereço <span className="font-normal text-marinho/50">(opcional, ajuda a calcular o frete)</span>
        </legend>
        <div className="grid gap-4 sm:grid-cols-6">
          <label className={`${label} sm:col-span-2`}>
            CEP
            <input
              name="cep"
              inputMode="numeric"
              maxLength={9}
              autoComplete="postal-code"
              defaultValue={initial.cep}
              onBlur={(e) => fillFromCep(e.target.value)}
              className={input}
            />
          </label>
          <label className={`${label} sm:col-span-4`}>
            Rua
            <input name="street" maxLength={160} autoComplete="address-line1" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} className={input} />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Número
            <input name="number" maxLength={20} defaultValue={initial.number} className={input} />
          </label>
          <label className={`${label} sm:col-span-4`}>
            Complemento
            <input name="complement" maxLength={80} autoComplete="address-line2" defaultValue={initial.complement} className={input} />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Bairro
            <input name="district" maxLength={80} value={addr.district} onChange={(e) => setAddr({ ...addr, district: e.target.value })} className={input} />
          </label>
          <label className={`${label} sm:col-span-3`}>
            Cidade
            <input name="city" maxLength={80} autoComplete="address-level2" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className={input} />
          </label>
          <label className={`${label} sm:col-span-1`}>
            UF
            <select name="state" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className={input}>
              <option value="">–</option>
              {UFS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="newsletter" defaultChecked={initial.newsletter} className="size-4 accent-royal" />
        Quero receber novidades e promoções da Qualilan por e-mail
      </label>
    </div>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpCustomer, undefined);
  if (state?.ok) {
    return (
      <div role="status" className="rounded-xl bg-emerald-50 p-5 text-emerald-900">
        <p className="font-semibold">Conta criada. Falta confirmar o e-mail.</p>
        <p className="mt-2 text-sm">
          Enviamos um link para {state.message}. Abra no mesmo navegador para ativar a conta e entrar.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={keepValues(action)} className="space-y-6">
      <ProfileFields initial={emptyProfile} />
      <fieldset className="space-y-4">
        <legend className="mb-3 text-sm font-semibold text-profundo">Informações de acesso</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={`${label} sm:col-span-2`}>
            E-mail
            <input name="email" type="email" required autoComplete="email" className={input} />
          </label>
          <label className={label}>
            Senha
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className={input} />
          </label>
          <label className={label}>
            Confirmar senha
            <input name="password_confirm" type="password" required minLength={8} autoComplete="new-password" className={input} />
          </label>
        </div>
        <p className="text-xs text-marinho/55">Mínimo de 8 caracteres.</p>
      </fieldset>
      <Errors error={state?.error} />
      <Submit pending={pending} idle="Criar conta" busy="Criando…" />
    </form>
  );
}

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const [state, action, pending] = useActionState(saveProfile, undefined);
  return (
    <form onSubmit={keepValues(action)} className="space-y-6">
      <ProfileFields initial={initial} />
      <Errors error={state?.error} />
      <div className="flex flex-wrap items-center gap-3">
        <Submit pending={pending} idle="Salvar dados" busy="Salvando…" />
        {state?.ok && !pending && (
          <span role="status" className="text-sm text-emerald-700">
            Dados salvos.
          </span>
        )}
      </div>
    </form>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  if (state?.ok) {
    return (
      <div role="status" className="rounded-xl bg-emerald-50 p-5 text-emerald-900">
        <p className="font-semibold">Confira seu e-mail</p>
        <p className="mt-2 text-sm">
          Se existir uma conta para {state.message}, enviamos um link para criar uma nova senha. Abra no mesmo navegador.
        </p>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <label className={label}>
        E-mail da conta
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <Errors error={state?.error} />
      <Submit pending={pending} idle="Enviar link de nova senha" busy="Enviando…" full />
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined);
  return (
    <form action={action} className="space-y-4">
      <label className={label}>
        Nova senha
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={input} />
      </label>
      <label className={label}>
        Confirmar nova senha
        <input name="password_confirm" type="password" required minLength={8} autoComplete="new-password" className={input} />
      </label>
      <Errors error={state?.error} />
      <Submit pending={pending} idle="Salvar nova senha" busy="Salvando…" full />
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
