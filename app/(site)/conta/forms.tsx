"use client";

import Link from "next/link";
import {
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  startTransition,
  useActionState,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { SpinnerRing } from "@/components/qualilan-loader";
import { useQuote } from "@/components/quote-cart";
import { formatPhone, mask, MASKS, onlyDigits } from "@/lib/documents";
import {
  type AccountState,
  changeEmail,
  deleteAccount,
  requestPasswordReset,
  saveProfile,
  signInCustomer,
  signUpCustomer,
  updatePassword,
} from "./actions";
import type { ProfileValues } from "./profile";

const inputClass =
  "mt-1.5 h-12 w-full rounded-md border border-profundo/15 bg-white px-4 text-[15px] text-marinho outline-none transition-[border-color,box-shadow] placeholder:text-marinho/35 hover:border-profundo/30 focus:border-royal focus:ring-4 focus:ring-royal/15 aria-invalid:border-red-600 aria-invalid:ring-red-600/10 read-only:bg-offwhite read-only:text-marinho/70";
const primary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-profundo px-6 text-[15px] font-semibold text-white transition-colors hover:bg-royal disabled:opacity-60";
const labelClass = "block text-sm font-medium text-profundo";
const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

// true só depois que o JavaScript carregou: antes disso o botão fica desativado
// (um envio antes da hora iria pela URL, com a senha junto).
const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

// Envio por POST, sem os balões do navegador: valida, marca os campos com erro e mantém o que foi digitado
// (o React limparia o formulário depois de uma action).
function submitWith(action: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.querySelector<HTMLElement>(":invalid")?.focus();
      return;
    }
    const fd = new FormData(form);
    startTransition(() => action(fd));
  };
}

function messageFor(input: HTMLInputElement, label: string) {
  const v = input.validity;
  if (v.valueMissing) return `Preencha ${label.toLowerCase()}.`;
  if (v.typeMismatch && input.type === "email") return "Digite um e-mail válido, como nome@empresa.com.br.";
  if (v.tooShort) return `Use pelo menos ${input.minLength} caracteres.`;
  if (v.patternMismatch) return input.title || "Confira este campo.";
  return "Confira este campo.";
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: ReactNode;
  format?: (v: string) => string;
  wrap?: string;
  after?: ReactNode;
  ref?: React.Ref<HTMLInputElement>;
};

function Field({ label, hint, format, wrap = "", after, onInput, ...props }: FieldProps) {
  const id = useId();
  const [error, setError] = useState("");
  return (
    <div className={wrap}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {hint && <span className="ml-1 font-normal text-marinho/45">{hint}</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          {...props}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-erro` : undefined}
          onInvalid={(e) => {
            e.preventDefault();
            setError(messageFor(e.currentTarget, label));
          }}
          onInput={(e) => {
            if (format) e.currentTarget.value = format(e.currentTarget.value);
            if (error) setError("");
            onInput?.(e);
          }}
          className={`${inputClass} ${after ? "pr-12" : ""}`}
        />
        {after}
      </div>
      {error && (
        <p id={`${id}-erro`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordField({ label, name, autoComplete }: { label: string; name: string; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label}
      name={name}
      type={show ? "text" : "password"}
      required
      minLength={autoComplete === "new-password" ? 8 : undefined}
      autoComplete={autoComplete}
      after={
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Esconder senha" : "Mostrar senha"}
          aria-pressed={show}
          className="absolute right-1.5 top-[calc(50%+3px)] grid size-9 -translate-y-1/2 place-items-center rounded-md text-marinho/45 hover:bg-offwhite hover:text-profundo"
        >
          <span aria-hidden className="icon text-xl!">
            {show ? "visibility_off" : "visibility"}
          </span>
        </button>
      }
    />
  );
}

function Errors({ state }: { state?: AccountState }) {
  return state?.error ? (
    <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
      {state.error}
    </p>
  ) : null;
}

function Submit({ pending, idle, busy, full, tone = "primary" }: { pending: boolean; idle: string; busy: string; full?: boolean; tone?: "primary" | "danger" }) {
  const hydrated = useHydrated();
  return (
    <button
      type="submit"
      disabled={pending || !hydrated}
      className={`${primary} ${tone === "danger" ? "bg-red-700 hover:bg-red-800" : ""} ${full ? "w-full" : ""}`}
    >
      {pending && <SpinnerRing />}
      {pending ? busy : idle}
    </button>
  );
}

function Done({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div role="status" className="py-4 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
        <span aria-hidden className="icon icon-fill text-3xl!">
          {icon}
        </span>
      </span>
      <p className="mt-4 text-lg font-bold text-profundo">{title}</p>
      <div className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-marinho/65">{children}</div>
    </div>
  );
}

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signInCustomer, undefined);
  return (
    <form method="post" noValidate onSubmit={submitWith(action)} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <Field label="E-mail" name="email" type="email" required autoComplete="email" />
      <PasswordField label="Senha" name="password" autoComplete="current-password" />
      <Link href="/conta/esqueci" className="inline-block text-sm font-semibold text-royal hover:underline">
        Esqueceu a sua senha?
      </Link>
      <Errors state={state} />
      <Submit pending={pending} idle="Entrar" busy="Entrando…" full />
      <p className="pt-2 text-center text-sm text-marinho/65">
        Ainda não tem conta?{" "}
        <Link href={next ? `/conta/criar?next=${encodeURIComponent(next)}` : "/conta/criar"} className="font-semibold text-royal hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}

// Seletor Empresa / Pessoa física (a Qualilan vende para empresas: Empresa vem primeiro).
function PersonType({ value, onChange }: { value: "pf" | "pj"; onChange: (v: "pf" | "pj") => void }) {
  return (
    <div role="radiogroup" aria-label="Tipo de cadastro" className="inline-flex rounded-md border border-profundo/15 p-1">
      {(["pj", "pf"] as const).map((t) => (
        <label
          key={t}
          className={`cursor-pointer rounded px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-laranja ${
            value === t ? "bg-profundo text-white" : "text-marinho/70 hover:bg-offwhite hover:text-profundo"
          }`}
        >
          <input type="radio" name="person_type" value={t} checked={value === t} onChange={() => onChange(t)} className="sr-only" />
          {t === "pj" ? "Empresa" : "Pessoa física"}
        </label>
      ))}
    </div>
  );
}

// CNPJ completo: busca a razão social na BrasilAPI (dados públicos da Receita) e preenche o campo.
function useCompanyLookup(companyRef: React.RefObject<HTMLInputElement | null>) {
  const [loading, setLoading] = useState(false);
  async function lookup(value: string) {
    const cnpj = onlyDigits(value);
    if (cnpj.length !== 14 || !companyRef.current || companyRef.current.value) return;
    setLoading(true);
    try {
      const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (r.ok) {
        const d = await r.json();
        if (companyRef.current && !companyRef.current.value && d.razao_social) companyRef.current.value = d.razao_social;
      }
    } catch {}
    setLoading(false);
  }
  return { loading, lookup };
}

const Busy = ({ text }: { text: string }) => (
  <span className="absolute right-3 top-[calc(50%+3px)] flex -translate-y-1/2 items-center gap-1.5 text-xs text-marinho/50">
    <SpinnerRing className="size-3.5" />
    {text}
  </span>
);

export function SignUpForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signUpCustomer, undefined);
  const [type, setType] = useState<"pf" | "pj">("pj");
  const company = useRef<HTMLInputElement>(null);
  const { loading, lookup } = useCompanyLookup(company);
  const pj = type === "pj";

  if (state?.ok) {
    return (
      <Done icon="mark_email_read" title="Falta só confirmar o e-mail">
        Enviamos um link para <strong className="text-profundo">{state.message}</strong>. Abra neste mesmo navegador para ativar
        a conta.
      </Done>
    );
  }
  return (
    <form method="post" noValidate onSubmit={submitWith(action)} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      <PersonType value={type} onChange={setType} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          key={type}
          wrap={pj ? "" : "sm:col-span-2"}
          label={pj ? "CNPJ" : "CPF"}
          name="doc"
          required
          inputMode="numeric"
          placeholder={pj ? MASKS.cnpj : MASKS.cpf}
          pattern={pj ? "\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}" : "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}"}
          title={pj ? "Digite os 14 números do CNPJ." : "Digite os 11 números do CPF."}
          format={(v) => mask(v, pj ? MASKS.cnpj : MASKS.cpf)}
          onInput={pj ? (e) => lookup(e.currentTarget.value) : undefined}
        />
        {pj && (
          <div className="relative">
            <Field ref={company} label="Razão social" name="company" required maxLength={160} autoComplete="organization" />
            {loading && <Busy text="Buscando" />}
          </div>
        )}
        <Field label="Seu nome" name="name" required minLength={2} maxLength={120} autoComplete="name" />
        <Field
          label="Celular (WhatsApp)"
          name="phone"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(14) 99999-9999"
          pattern="\(\d{2}\) \d{4,5}-\d{4}"
          title="Digite o celular com DDD."
          format={formatPhone}
        />
        <Field wrap="sm:col-span-2" label="E-mail" name="email" type="email" required autoComplete="email" />
        <PasswordField label="Senha (mínimo de 8 caracteres)" name="password" autoComplete="new-password" />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-marinho/75">
        <input type="checkbox" name="newsletter" className="mt-0.5 size-4 accent-royal" />
        Quero receber lançamentos e promoções da Qualilan por e-mail.
      </label>
      <Errors state={state} />
      <Submit pending={pending} idle="Criar conta" busy="Criando…" full />
      <p className="text-center text-xs leading-relaxed text-marinho/50">
        Ao criar a conta você aceita os{" "}
        <Link href="/termos-de-uso" className="underline hover:text-profundo">
          termos de uso
        </Link>{" "}
        e a{" "}
        <Link href="/privacidade" className="underline hover:text-profundo">
          política de privacidade
        </Link>
        . Endereço e inscrição estadual você completa depois, em Meus dados.
      </p>
    </form>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-5 border-t border-profundo/10 pt-8 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr] md:gap-8">
      <legend className="contents">
        <span>
          <span className="block font-semibold text-profundo">{title}</span>
          {hint && <span className="mt-1 block text-sm leading-snug text-marinho/55">{hint}</span>}
        </span>
      </legend>
      <div className="min-w-0">{children}</div>
    </fieldset>
  );
}

// Meus dados. CPF/CNPJ já gravado aparece travado: troca só pela Central SAC (o banco também barra).
export function ProfileForm({ initial, locked, sac }: { initial: ProfileValues; locked: boolean; sac: string }) {
  const [state, action, pending] = useActionState(saveProfile, undefined);
  const [type, setType] = useState(initial.person_type);
  const [addr, setAddr] = useState({ street: initial.street, district: initial.district, city: initial.city, state: initial.state });
  const [cepLoading, setCepLoading] = useState(false);
  const numberRef = useRef<HTMLInputElement>(null);
  const company = useRef<HTMLInputElement>(null);
  const { loading, lookup } = useCompanyLookup(company);
  const pj = type === "pj";
  const docMask = pj ? MASKS.cnpj : MASKS.cpf;

  // CEP completo: busca o endereço (ViaCEP) na hora e leva o cursor para o número.
  async function fillFromCep(value: string) {
    const digits = onlyDigits(value);
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setAddr({ street: d.logradouro ?? "", district: d.bairro ?? "", city: d.localidade ?? "", state: d.uf ?? "" });
        numberRef.current?.focus();
      }
    } catch {}
    setCepLoading(false);
  }

  return (
    <form method="post" noValidate onSubmit={submitWith(action)} className="space-y-8">
      <Section title={pj ? "Empresa" : "Seus dados"} hint="Para a nota fiscal e para o vendedor saber com quem fala.">
        {locked ? (
          <input type="hidden" name="person_type" value={type} />
        ) : (
          <div className="mb-5">
            <PersonType value={type} onChange={setType} />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            key={type}
            label={pj ? "CNPJ" : "CPF"}
            name="doc"
            required
            readOnly={locked}
            inputMode="numeric"
            placeholder={docMask}
            format={(v) => mask(v, docMask)}
            onInput={pj && !locked ? (e) => lookup(e.currentTarget.value) : undefined}
            defaultValue={type === initial.person_type ? mask(initial.doc, docMask) : ""}
            hint={locked ? "(para trocar, fale com a Central SAC)" : undefined}
          />
          {pj && (
            <>
              <div className="relative">
                <Field ref={company} label="Razão social" name="company" required maxLength={160} autoComplete="organization" defaultValue={initial.company} />
                {loading && <Busy text="Buscando" />}
              </div>
              <Field label="Inscrição estadual" hint="(opcional)" name="rg_ie" maxLength={30} defaultValue={initial.rg_ie} />
            </>
          )}
          <Field label={pj ? "Responsável" : "Nome"} name="name" required minLength={2} maxLength={120} autoComplete="given-name" defaultValue={initial.name} />
          <Field label="Sobrenome" hint="(opcional)" name="last_name" maxLength={120} autoComplete="family-name" defaultValue={initial.last_name} />
          <Field
            label="Celular (WhatsApp)"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(14) 99999-9999"
            format={formatPhone}
            defaultValue={formatPhone(initial.phone)}
          />
        </div>
        {locked && <p className="mt-3 text-xs text-marinho/50">CPF ou CNPJ não muda pelo site. Central SAC: {sac}.</p>}
      </Section>

      <Section title="Endereço de entrega" hint="Ajuda o vendedor a calcular o frete. O CEP preenche o resto.">
        <div className="grid gap-4 sm:grid-cols-6">
          <div className="relative sm:col-span-2">
            <Field
              label="CEP"
              name="cep"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder={MASKS.cep}
              format={(v) => mask(v, MASKS.cep)}
              onInput={(e) => fillFromCep(e.currentTarget.value)}
              defaultValue={mask(initial.cep, MASKS.cep)}
            />
            {cepLoading && <Busy text="Buscando" />}
          </div>
          <Field wrap="sm:col-span-4" label="Rua" name="street" maxLength={160} autoComplete="address-line1" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} />
          <Field ref={numberRef} wrap="sm:col-span-2" label="Número" name="number" maxLength={20} defaultValue={initial.number} />
          <Field wrap="sm:col-span-4" label="Complemento" hint="(opcional)" name="complement" maxLength={80} autoComplete="address-line2" defaultValue={initial.complement} />
          <Field wrap="sm:col-span-3" label="Bairro" name="district" maxLength={80} value={addr.district} onChange={(e) => setAddr({ ...addr, district: e.target.value })} />
          <Field wrap="sm:col-span-2" label="Cidade" name="city" maxLength={80} autoComplete="address-level2" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
          <div className="sm:col-span-1">
            <label htmlFor="uf" className={labelClass}>
              UF
            </label>
            <select id="uf" name="state" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className={`${inputClass} px-2`}>
              <option value="">UF</option>
              {UFS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Novidades">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-marinho/80">
          <input type="checkbox" name="newsletter" defaultChecked={initial.newsletter} className="mt-0.5 size-4 accent-royal" />
          Quero receber lançamentos e promoções da Qualilan por e-mail.
        </label>
      </Section>

      <div className="flex flex-col gap-4 border-t border-profundo/10 pt-8 md:pl-[232px]">
        <Errors state={state} />
        <div className="flex flex-wrap items-center gap-4">
          <Submit pending={pending} idle="Salvar alterações" busy="Salvando…" />
          {state?.ok && !pending && (
            <span role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <span aria-hidden className="icon icon-fill text-lg!">
                check_circle
              </span>
              Alterações salvas
            </span>
          )}
        </div>
      </div>
    </form>
  );
}

export function ChangeEmailForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(changeEmail, undefined);
  if (state?.ok) {
    return (
      <p role="status" className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        Enviamos um link para <strong>{state.message}</strong>. O e-mail só muda depois que você abrir o link.
      </p>
    );
  }
  return (
    <form method="post" noValidate onSubmit={submitWith(action)} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field wrap="flex-1" label="Novo e-mail" name="email" type="email" required autoComplete="email" placeholder={email} />
        <Submit pending={pending} idle="Trocar e-mail" busy="Enviando…" />
      </div>
      <Errors state={state} />
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteAccount, undefined);
  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-sm font-semibold text-red-700 hover:underline [&::-webkit-details-marker]:hidden">
        Excluir minha conta
      </summary>
      <form method="post" noValidate onSubmit={submitWith(action)} className="mt-4 space-y-3 rounded-md border border-red-200 bg-red-50/50 p-4">
        <p className="text-sm text-marinho/75">
          Seus dados de cadastro e o acesso são apagados na hora e não dá para desfazer. Os orçamentos já enviados ficam com a
          nossa equipe, sem ligação com você.
        </p>
        <Field label="Digite EXCLUIR para confirmar" name="confirm" required autoComplete="off" pattern="[Ee][Xx][Cc][Ll][Uu][Ii][Rr]" title="Digite EXCLUIR." />
        <Errors state={state} />
        <Submit pending={pending} idle="Excluir conta" busy="Excluindo…" tone="danger" />
      </form>
    </details>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  if (state?.ok) {
    return (
      <Done icon="mark_email_read" title="Confira seu e-mail">
        Se existir uma conta para <strong className="text-profundo">{state.message}</strong>, chega em instantes um link para criar
        a nova senha. Abra neste mesmo navegador.
      </Done>
    );
  }
  return (
    <form method="post" noValidate onSubmit={submitWith(action)} className="space-y-4">
      <Field label="E-mail da conta" name="email" type="email" required autoComplete="email" />
      <Errors state={state} />
      <Submit pending={pending} idle="Enviar link" busy="Enviando…" full />
    </form>
  );
}

export function NewPasswordForm({ needsCurrent }: { needsCurrent: boolean }) {
  const [state, action, pending] = useActionState(updatePassword, undefined);
  return (
    <form method="post" noValidate onSubmit={submitWith(action)} className="space-y-4">
      {needsCurrent && <PasswordField label="Senha atual" name="current_password" autoComplete="current-password" />}
      <PasswordField label="Nova senha (mínimo de 8 caracteres)" name="password" autoComplete="new-password" />
      <Errors state={state} />
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
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-profundo/15 px-3 py-2 text-sm font-semibold text-profundo transition-colors hover:border-profundo hover:bg-profundo hover:text-white"
    >
      <span aria-hidden className="icon text-lg!">
        replay
      </span>
      Pedir de novo
    </button>
  );
}

// Lista atual (fica no navegador): atalho discreto na faixa do painel; o laranja fica só no selo.
export function CurrentList() {
  const { items, count, open } = useQuote();
  if (!items.length) {
    return (
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-2 rounded-md border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        <span aria-hidden className="icon text-xl!">
          grid_view
        </span>
        Montar nova lista
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center gap-2 rounded-md border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
    >
      <span aria-hidden className="icon text-xl!">
        list_alt
      </span>
      Lista de orçamento
      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-laranja px-1 text-[11px] font-bold tabular-nums text-profundo">
        {count}
      </span>
    </button>
  );
}
