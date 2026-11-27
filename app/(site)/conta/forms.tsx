"use client";

import Link from "next/link";
import { type FormEvent, type InputHTMLAttributes, type ReactNode, startTransition, useActionState, useState } from "react";
import { SpinnerRing } from "@/components/qualilan-loader";
import { useQuote } from "@/components/quote-cart";
import { formatPhone, mask, MASKS } from "@/lib/documents";
import { emptyProfile, type ProfileValues } from "./profile";
import { requestPasswordReset, saveProfile, signInCustomer, signUpCustomer, updatePassword } from "./actions";

const inputClass =
  "mt-1.5 h-12 w-full rounded-xl border border-profundo/15 bg-white px-4 text-[15px] text-marinho outline-none transition-[border-color,box-shadow] placeholder:text-marinho/35 hover:border-profundo/30 focus:border-royal focus:ring-4 focus:ring-royal/15";
const primary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-profundo px-6 text-[15px] font-semibold text-white transition-colors hover:bg-royal disabled:opacity-60";
const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

// O React limpa o formulário após uma action; enviando assim, os campos ficam preenchidos quando há erro.
function keepValues(action: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  };
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode; format?: (v: string) => string; wrap?: string };

function Field({ label, hint, format, wrap = "", ...props }: FieldProps) {
  return (
    <label className={`block text-sm font-medium text-profundo ${wrap}`}>
      {label}
      {hint && <span className="ml-1 font-normal text-marinho/45">{hint}</span>}
      <input
        {...props}
        onInput={format ? (e) => (e.currentTarget.value = format(e.currentTarget.value)) : undefined}
        className={inputClass}
      />
    </label>
  );
}

function PasswordField({ label, name, autoComplete }: { label: string; name: string; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block text-sm font-medium text-profundo">
      {label}
      <span className="relative block">
        <input
          name={name}
          type={show ? "text" : "password"}
          required
          minLength={autoComplete === "new-password" ? 8 : undefined}
          autoComplete={autoComplete}
          className={`${inputClass} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Esconder senha" : "Mostrar senha"}
          className="absolute right-1.5 top-[calc(50%+3px)] grid size-9 -translate-y-1/2 place-items-center rounded-lg text-marinho/45 hover:bg-offwhite hover:text-profundo"
        >
          <span className="icon text-xl!">{show ? "visibility_off" : "visibility"}</span>
        </button>
      </span>
    </label>
  );
}

function Errors({ error }: { error?: string }) {
  return error ? (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
      <span className="icon mt-px text-lg!">close</span>
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
      <Field label="E-mail" name="email" type="email" required autoComplete="email" />
      <PasswordField label="Senha" name="password" autoComplete="current-password" />
      <div className="flex justify-end">
        <Link href="/conta/esqueci" className="text-sm font-semibold text-royal hover:underline">
          Esqueceu a sua senha?
        </Link>
      </div>
      <Errors error={state?.error} />
      <Submit pending={pending} idle="Entrar" busy="Entrando…" full />
    </form>
  );
}

// Bloco do cadastro. Numerado no "Criar conta": ali é uma sequência (quem compra, endereço, acesso).
function Step({ n, title, hint, children }: { n?: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-5 border-t border-profundo/10 pt-8 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr] md:gap-8">
      <legend className="contents">
        <span className="flex items-start gap-3">
          {n && (
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-profundo text-xs font-bold tabular-nums text-white">
              {n}
            </span>
          )}
          <span>
            <span className="block font-semibold text-profundo">{title}</span>
            {hint && <span className="mt-1 block text-sm leading-snug text-marinho/55">{hint}</span>}
          </span>
        </span>
      </legend>
      <div className="min-w-0">{children}</div>
    </fieldset>
  );
}

// Campos do cadastro (iguais aos da loja antiga), usados em "Criar conta" e em "Meus dados".
function ProfileSteps({ initial, numbered }: { initial: ProfileValues; numbered?: boolean }) {
  const [type, setType] = useState(initial.person_type);
  const [addr, setAddr] = useState({ street: initial.street, district: initial.district, city: initial.city, state: initial.state });
  const pj = type === "pj";
  const docMask = pj ? MASKS.cnpj : MASKS.cpf;

  // CEP preenche o endereço (ViaCEP, serviço público); se falhar, a pessoa digita.
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
    <>
      <Step n={numbered ? 1 : undefined} title="Quem compra" hint="Para a nota fiscal e para o vendedor saber com quem fala.">
        <div role="radiogroup" aria-label="Tipo de cadastro" className="mb-5 inline-flex rounded-xl bg-offwhite p-1">
          {(["pf", "pj"] as const).map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-laranja ${
                type === t ? "bg-white text-profundo shadow-sm" : "text-marinho/55 hover:text-profundo"
              }`}
            >
              <input type="radio" name="person_type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
              {t === "pf" ? "Pessoa física" : "Empresa (CNPJ)"}
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {pj && (
            <Field wrap="sm:col-span-2" label="Razão social" name="company" required maxLength={160} autoComplete="organization" defaultValue={initial.company} />
          )}
          <Field
            key={type}
            label={pj ? "CNPJ" : "CPF"}
            name="doc"
            required
            inputMode="numeric"
            placeholder={docMask}
            format={(v) => mask(v, docMask)}
            defaultValue={type === initial.person_type ? mask(initial.doc, docMask) : ""}
          />
          <Field label={pj ? "Inscrição estadual" : "RG"} hint="(opcional)" name="rg_ie" maxLength={30} defaultValue={initial.rg_ie} />
          <Field
            label={pj ? "Nome do responsável" : "Nome"}
            name="name"
            required
            minLength={2}
            maxLength={120}
            autoComplete="given-name"
            defaultValue={initial.name}
          />
          <Field label="Sobrenome" name="last_name" maxLength={120} autoComplete="family-name" defaultValue={initial.last_name} />
          <Field
            label="Celular"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(14) 99999-9999"
            format={formatPhone}
            defaultValue={formatPhone(initial.phone)}
          />
        </div>
      </Step>

      <Step n={numbered ? 2 : undefined} title="Endereço" hint="Opcional. Ajuda o vendedor a calcular o frete. O CEP preenche o resto.">
        <div className="grid gap-4 sm:grid-cols-6">
          <Field
            wrap="sm:col-span-2"
            label="CEP"
            name="cep"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder={MASKS.cep}
            format={(v) => mask(v, MASKS.cep)}
            defaultValue={mask(initial.cep, MASKS.cep)}
            onBlur={(e) => fillFromCep(e.target.value)}
          />
          <Field
            wrap="sm:col-span-4"
            label="Rua"
            name="street"
            maxLength={160}
            autoComplete="address-line1"
            value={addr.street}
            onChange={(e) => setAddr({ ...addr, street: e.target.value })}
          />
          <Field wrap="sm:col-span-2" label="Número" name="number" maxLength={20} defaultValue={initial.number} />
          <Field wrap="sm:col-span-4" label="Complemento" name="complement" maxLength={80} autoComplete="address-line2" defaultValue={initial.complement} />
          <Field
            wrap="sm:col-span-2"
            label="Bairro"
            name="district"
            maxLength={80}
            value={addr.district}
            onChange={(e) => setAddr({ ...addr, district: e.target.value })}
          />
          <Field
            wrap="sm:col-span-3"
            label="Cidade"
            name="city"
            maxLength={80}
            autoComplete="address-level2"
            value={addr.city}
            onChange={(e) => setAddr({ ...addr, city: e.target.value })}
          />
          <label className="block text-sm font-medium text-profundo sm:col-span-1">
            UF
            <select name="state" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className={inputClass}>
              <option value="">–</option>
              {UFS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-offwhite p-4 text-sm text-marinho/80">
          <input type="checkbox" name="newsletter" defaultChecked={initial.newsletter} className="mt-0.5 size-4 accent-royal" />
          Quero receber lançamentos e promoções da Qualilan por e-mail.
        </label>
      </Step>
    </>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpCustomer, undefined);
  if (state?.ok) {
    return (
      <div role="status" className="py-6 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
          <span className="icon icon-fill text-4xl!">mark_email_read</span>
        </span>
        <p className="mt-5 text-xl font-bold text-profundo">Falta só confirmar o e-mail</p>
        <p className="mx-auto mt-2 max-w-sm text-marinho/65">
          Enviamos um link para <strong className="text-profundo">{state.message}</strong>. Abra neste mesmo navegador para
          ativar a conta.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={keepValues(action)} className="space-y-8">
      <ProfileSteps initial={emptyProfile} numbered />
      <Step n={3} title="Acesso" hint="Com e-mail e senha você entra de qualquer aparelho.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field wrap="sm:col-span-2" label="E-mail" name="email" type="email" required autoComplete="email" />
          <PasswordField label="Senha" name="password" autoComplete="new-password" />
          <PasswordField label="Confirmar senha" name="password_confirm" autoComplete="new-password" />
        </div>
        <p className="mt-2 text-xs text-marinho/50">Mínimo de 8 caracteres.</p>
      </Step>
      <div className="flex flex-col gap-4 border-t border-profundo/10 pt-8 md:pl-[232px]">
        <Errors error={state?.error} />
        <div className="flex flex-wrap items-center gap-4">
          <Submit pending={pending} idle="Criar conta" busy="Criando…" />
          <p className="max-w-xs text-xs leading-relaxed text-marinho/50">
            Ao criar a conta você aceita os{" "}
            <Link href="/termos-de-uso" className="underline hover:text-profundo">
              termos de uso
            </Link>{" "}
            e a{" "}
            <Link href="/privacidade" className="underline hover:text-profundo">
              política de privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </form>
  );
}

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const [state, action, pending] = useActionState(saveProfile, undefined);
  return (
    <form onSubmit={keepValues(action)} className="space-y-8">
      <ProfileSteps initial={initial} />
      <div className="flex flex-col gap-4 border-t border-profundo/10 pt-8 md:pl-[232px]">
        <Errors error={state?.error} />
        <div className="flex flex-wrap items-center gap-4">
          <Submit pending={pending} idle="Salvar alterações" busy="Salvando…" />
          {state?.ok && !pending && (
            <span role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <span className="icon icon-fill text-lg!">check_circle</span>
              Alterações salvas
            </span>
          )}
        </div>
      </div>
    </form>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  if (state?.ok) {
    return (
      <div role="status" className="text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
          <span className="icon icon-fill text-3xl!">mark_email_read</span>
        </span>
        <p className="mt-4 text-lg font-bold text-profundo">Confira seu e-mail</p>
        <p className="mt-2 text-sm text-marinho/65">
          Se existir uma conta para <strong className="text-profundo">{state.message}</strong>, chega em instantes um link para
          criar a nova senha. Abra neste mesmo navegador.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={keepValues(action)} className="space-y-4">
      <Field label="E-mail da conta" name="email" type="email" required autoComplete="email" />
      <Errors error={state?.error} />
      <Submit pending={pending} idle="Enviar link" busy="Enviando…" full />
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined);
  return (
    <form onSubmit={keepValues(action)} className="space-y-4">
      <PasswordField label="Nova senha" name="password" autoComplete="new-password" />
      <PasswordField label="Confirmar nova senha" name="password_confirm" autoComplete="new-password" />
      <p className="text-xs text-marinho/50">Mínimo de 8 caracteres.</p>
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
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-profundo/15 px-3 py-2 text-sm font-semibold text-profundo transition-colors hover:border-profundo hover:bg-profundo hover:text-white"
    >
      <span className="icon text-lg!">replay</span>
      Pedir de novo
    </button>
  );
}

// Lista atual (fica no navegador): atalho no painel para continuar de onde parou.
export function CurrentList() {
  const { items, count, open } = useQuote();
  if (!items.length) {
    return (
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        <span className="icon text-xl!">grid_view</span>
        Montar nova lista
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center gap-2 rounded-xl bg-laranja px-4 py-2.5 text-sm font-semibold text-profundo transition-colors hover:bg-amarelo"
    >
      <span className="icon icon-fill text-xl!">shopping_cart</span>
      Lista em andamento ({count} {count === 1 ? "item" : "itens"})
    </button>
  );
}
