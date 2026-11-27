import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutCustomer } from "./actions";
import { ProfileForm, type ProfileValues, ReorderButton, SignInForm, emptyProfile } from "./forms";

export const metadata: Metadata = {
  title: "Minha conta | Qualilan",
  robots: { index: false, follow: false },
};

type Item = { slug: string; name: string; sku: string | null; qty: number };

const card = "rounded-2xl border border-profundo/10 bg-white p-6 md:p-8";

const perks = [
  { icon: "history", text: "Histórico de todos os orçamentos enviados, pelo WhatsApp e por e-mail." },
  { icon: "replay", text: "“Pedir de novo” em um toque: os itens voltam para a lista." },
  { icon: "badge", text: "Dados da empresa salvos: o pedido por e-mail já vem preenchido." },
];

async function Account({ searchParams }: { searchParams: PageProps<"/conta">["searchParams"] }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const params = await searchParams;
  const linkError = params.erro === "link";
  const passwordChanged = params.senha === "ok";

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-profundo md:text-4xl">Minha conta</h1>
        {linkError && (
          <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            O link expirou ou já foi usado. Entre com sua senha ou peça um novo em “Esqueceu a sua senha?”.
          </p>
        )}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className={card}>
            <h2 className="text-lg font-bold text-profundo">Clientes registrados</h2>
            <p className="mb-5 mt-1 text-sm text-marinho/60">Se você tem uma conta, entre com seu e-mail.</p>
            <SignInForm />
          </section>
          <section className={`${card} flex flex-col`}>
            <h2 className="text-lg font-bold text-profundo">Novos clientes</h2>
            <p className="mt-1 text-sm text-marinho/60">
              A conta é opcional: a lista e o envio pelo WhatsApp funcionam sem login. Com ela você tem:
            </p>
            <ul className="mt-5 space-y-4">
              {perks.map((p) => (
                <li key={p.icon} className="flex gap-3">
                  <span className="icon mt-0.5 text-xl! text-royal">{p.icon}</span>
                  <span className="text-marinho/80">{p.text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/conta/criar"
              className="mt-8 inline-flex items-center justify-center gap-2 self-start rounded-lg border border-profundo px-5 py-3 text-sm font-semibold text-profundo transition-colors hover:bg-profundo hover:text-white md:mt-auto"
            >
              <span className="icon text-lg!">person</span>
              Criar conta
            </Link>
          </section>
        </div>
      </div>
    );
  }

  const cols = "person_type, name, last_name, company, cpf, cnpj, rg_ie, phone, cep, street, number, complement, district, city, state, newsletter";
  const [{ data: found }, { data: requests }] = await Promise.all([
    supabase.from("customers").select(cols).eq("user_id", user.id).maybeSingle(),
    supabase
      .from("quote_requests")
      .select("id, channel, items, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  let profile = found;
  // Conta confirmada por e-mail: o cadastro veio guardado no usuário; cria o perfil no primeiro acesso.
  const pending = user.user_metadata?.profile;
  if (!profile && pending && typeof pending === "object") {
    const { data } = await supabase
      .from("customers")
      // Só as colunas conhecidas: os metadados do usuário são editáveis por ele.
      .upsert({ ...Object.fromEntries(cols.split(", ").map((c) => [c, pending[c] ?? null])), user_id: user.id })
      .select(cols)
      .maybeSingle();
    profile = data;
  }

  const initial: ProfileValues = profile
    ? {
        person_type: profile.person_type === "pj" ? "pj" : "pf",
        name: profile.name ?? "",
        last_name: profile.last_name ?? "",
        company: profile.company ?? "",
        doc: (profile.person_type === "pj" ? profile.cnpj : profile.cpf) ?? "",
        rg_ie: profile.rg_ie ?? "",
        phone: profile.phone ?? "",
        cep: profile.cep ?? "",
        street: profile.street ?? "",
        number: profile.number ?? "",
        complement: profile.complement ?? "",
        district: profile.district ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        newsletter: Boolean(profile.newsletter),
      }
    : emptyProfile;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-5 py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-profundo md:text-4xl">
            Olá{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-marinho/60">{user.email}</p>
        </div>
        <form action={signOutCustomer}>
          <button type="submit" className="inline-flex items-center gap-1.5 text-sm font-semibold text-marinho/60 hover:text-profundo">
            <span className="icon text-lg!">logout</span>
            Sair
          </button>
        </form>
      </div>

      {passwordChanged && (
        <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Senha alterada.
        </p>
      )}

      <section className={card}>
        <h2 className="text-lg font-bold text-profundo">Meus dados</h2>
        <p className="mb-5 mt-1 text-sm text-marinho/60">Usados para preencher o pedido de orçamento por e-mail.</p>
        <ProfileForm initial={initial} />
      </section>

      <section className={card}>
        <h2 className="text-lg font-bold text-profundo">Meus orçamentos</h2>
        <ul className="mt-5 divide-y divide-profundo/10">
          {(requests ?? []).map((r) => {
            const items = r.items as Item[];
            return (
              <li key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-profundo">
                    {new Date(r.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" })}
                    <span className="rounded-md bg-offwhite px-2 py-0.5 text-xs font-medium text-marinho/70">
                      {r.channel === "whatsapp" ? "WhatsApp" : "E-mail"}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-marinho/65">
                    {items.map((i) => `${i.qty}x ${i.name}`).join(" · ")}
                  </p>
                </div>
                <div className="shrink-0">
                  <ReorderButton items={items} />
                </div>
              </li>
            );
          })}
          {(requests ?? []).length === 0 && (
            <li className="py-6 text-sm text-marinho/60">
              Nenhum orçamento ainda. Monte sua lista no{" "}
              <Link href="/catalogo" className="font-semibold text-royal hover:underline">
                catálogo
              </Link>{" "}
              e envie pelo WhatsApp ou por e-mail: ele aparece aqui.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

export default function AccountPage({ searchParams }: PageProps<"/conta">) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Account searchParams={searchParams} />
    </Suspense>
  );
}
