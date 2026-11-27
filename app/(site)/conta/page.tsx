import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { formatPhone, mask, MASKS } from "@/lib/documents";
import { site, whatsappLink } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutCustomer } from "./actions";
import { loadProfile } from "./data";
import { CurrentList, ReorderButton, SignInForm } from "./forms";
import { AccountShell, panel } from "./shell";

export const metadata: Metadata = {
  title: "Minha conta | Qualilan",
  robots: { index: false, follow: false },
};

type Item = { slug: string; name: string; sku: string | null; qty: number };

const perks = [
  { icon: "history", title: "Histórico de orçamentos", text: "Tudo o que você pediu, pelo WhatsApp ou por e-mail, num lugar só." },
  { icon: "replay", title: "Pedir de novo", text: "Os itens de um orçamento antigo voltam para a lista em um clique." },
  { icon: "badge", title: "Cadastro salvo", text: "O pedido por e-mail já vem preenchido com os dados da empresa." },
];

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function SignedOut({ linkError }: { linkError: boolean }) {
  return (
    <AccountShell
      title="Minha conta"
      intro="Entre para ver seus orçamentos e pedir de novo. A conta é opcional: a lista e o WhatsApp funcionam sem login."
      width="max-w-5xl"
    >
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,420px)_1fr] md:gap-14">
        <section className={panel}>
          <h2 className="text-xl font-bold text-profundo">Já sou cliente</h2>
          <p className="mb-6 mt-1 text-sm text-marinho/60">Entre com o e-mail e a senha da sua conta.</p>
          {linkError && (
            <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              O link expirou ou já foi usado. Entre com sua senha ou peça outro em “Esqueceu a sua senha?”.
            </p>
          )}
          <SignInForm />
        </section>

        <section className="md:pt-24">
          <h2 className="text-xl font-bold text-profundo">Primeira vez aqui?</h2>
          <p className="mt-1 text-marinho/65">Crie a conta em um minuto, com CPF ou CNPJ.</p>
          <ul className="mt-7 space-y-6">
            {perks.map((p) => (
              <li key={p.icon} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal">
                  <span className="icon">{p.icon}</span>
                </span>
                <span>
                  <span className="block font-semibold text-profundo">{p.title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-marinho/65">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/conta/criar"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl border-2 border-profundo px-6 text-[15px] font-semibold text-profundo transition-colors hover:bg-profundo hover:text-white"
          >
            Criar conta
          </Link>
        </section>
      </div>
    </AccountShell>
  );
}

async function Account({ searchParams }: { searchParams: PageProps<"/conta">["searchParams"] }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const params = await searchParams;
  if (!user) return <SignedOut linkError={params.erro === "link"} />;

  const [profile, { data: requests }] = await Promise.all([
    loadProfile(supabase, user),
    supabase
      .from("quote_requests")
      .select("id, channel, items, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  const list = requests ?? [];
  const firstName = profile?.name.split(" ")[0];
  const pj = profile?.person_type === "pj";
  const address = profile?.street
    ? [`${profile.street}${profile.number ? `, ${profile.number}` : ""}`, [profile.city, profile.state].filter(Boolean).join("/")]
    : null;

  return (
    <AccountShell
      title={firstName ? `Olá, ${firstName}` : "Minha conta"}
      intro={pj && profile?.company ? profile.company : user.email}
      aside={
        <div className="flex flex-wrap items-center gap-3">
          <CurrentList />
          <form action={signOutCustomer}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span className="icon text-lg!">logout</span>
              Sair
            </button>
          </form>
        </div>
      }
    >
      {params.senha === "ok" && (
        <p role="status" className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-sm">
          <span className="icon icon-fill text-lg!">check_circle</span>
          Senha alterada.
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <section className={panel}>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold text-profundo">Meus orçamentos</h2>
            {list.length > 0 && <span className="text-sm text-marinho/50">{plural(list.length, "pedido", "pedidos")}</span>}
          </div>

          {list.length === 0 ? (
            <div className="mt-6 rounded-xl border-2 border-dashed border-profundo/10 px-6 py-12 text-center">
              <span className="icon text-4xl! text-royal/40">receipt_long</span>
              <p className="mt-3 font-semibold text-profundo">Nenhum orçamento ainda</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-marinho/60">
                Monte a lista no catálogo e envie pelo WhatsApp ou por e-mail. Cada pedido aparece aqui para você repetir quando
                precisar.
              </p>
              <Link
                href="/catalogo"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-profundo px-5 text-sm font-semibold text-white hover:bg-royal"
              >
                <span className="icon text-xl!">grid_view</span>
                Abrir o catálogo
              </Link>
            </div>
          ) : (
            <ol className="mt-4 divide-y divide-profundo/10">
              {list.map((r) => {
                const items = r.items as Item[];
                const units = items.reduce((n, i) => n + i.qty, 0);
                const date = new Date(r.created_at);
                const tz = { timeZone: "America/Sao_Paulo" } as const;
                return (
                  <li key={r.id} className="py-5">
                    <div className="flex gap-4">
                      <div className="w-12 shrink-0 text-center">
                        <span className="block text-2xl font-bold leading-none tabular-nums text-profundo">
                          {date.toLocaleDateString("pt-BR", { day: "2-digit", ...tz })}
                        </span>
                        <span className="mt-1 block text-xs font-medium text-marinho/50">
                          {date.toLocaleDateString("pt-BR", { month: "short", ...tz }).replace(".", "")}{" "}
                          {date.toLocaleDateString("pt-BR", { year: "2-digit", ...tz })}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <p className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-profundo">
                            {r.channel === "whatsapp" ? (
                              <WhatsAppIcon className="size-4 text-[#128C7E]" />
                            ) : (
                              <span className="icon text-lg! text-royal">mail</span>
                            )}
                            {r.channel === "whatsapp" ? "WhatsApp" : "E-mail"}
                            <span className="font-normal text-marinho/50">
                              {plural(items.length, "produto", "produtos")}, {plural(units, "item", "itens")}
                            </span>
                          </p>
                          <ReorderButton items={items} />
                        </div>
                        <details className="group mt-2">
                          <summary className="cursor-pointer list-none text-sm text-marinho/70 [&::-webkit-details-marker]:hidden">
                            <span className="line-clamp-1 group-open:hidden">
                              {items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                            </span>
                            <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-royal">
                              <span className="group-open:hidden">Ver itens</span>
                              <span className="hidden group-open:inline">Esconder itens</span>
                              <span className="icon text-base! transition-transform group-open:rotate-90">chevron_right</span>
                            </span>
                          </summary>
                          <ul className="mt-2 space-y-1.5 rounded-xl bg-offwhite p-4 text-sm">
                            {items.map((i) => (
                              <li key={i.slug} className="flex gap-3">
                                <span className="w-10 shrink-0 text-right font-semibold tabular-nums text-profundo">{i.qty}x</span>
                                <Link href={`/produto/${i.slug}`} className="min-w-0 text-marinho/80 hover:text-royal hover:underline">
                                  {i.name}
                                  {i.sku && <span className="ml-1.5 text-marinho/45">cód. {i.sku}</span>}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <aside className="space-y-6">
          <section className={panel}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-profundo">Meus dados</h2>
              <Link href="/conta/dados" className="inline-flex items-center gap-1 text-sm font-semibold text-royal hover:underline">
                <span className="icon text-lg!">edit</span>
                Editar
              </Link>
            </div>
            {profile ? (
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-marinho/50">{pj ? "Responsável" : "Nome"}</dt>
                  <dd className="mt-0.5 font-medium text-profundo">{[profile.name, profile.last_name].filter(Boolean).join(" ")}</dd>
                </div>
                <div>
                  <dt className="text-marinho/50">{pj ? "CNPJ" : "CPF"}</dt>
                  <dd className="mt-0.5 font-medium tabular-nums text-profundo">{mask(profile.doc, pj ? MASKS.cnpj : MASKS.cpf)}</dd>
                </div>
                {profile.phone && (
                  <div>
                    <dt className="text-marinho/50">Celular</dt>
                    <dd className="mt-0.5 font-medium tabular-nums text-profundo">{formatPhone(profile.phone)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-marinho/50">E-mail</dt>
                  <dd className="mt-0.5 break-all font-medium text-profundo">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-marinho/50">Endereço</dt>
                  <dd className="mt-0.5 font-medium text-profundo">
                    {address ? (
                      <>
                        {address[0]}
                        <span className="block font-normal text-marinho/60">{address[1]}</span>
                      </>
                    ) : (
                      <Link href="/conta/dados" className="font-normal text-royal hover:underline">
                        Adicionar endereço
                      </Link>
                    )}
                  </dd>
                </div>
              </dl>
            ) : (
              <div className="mt-4 rounded-xl bg-laranja/15 p-4 text-sm text-profundo">
                Complete o cadastro para o pedido por e-mail já vir preenchido.
                <Link href="/conta/dados" className="mt-2 block font-semibold underline">
                  Completar cadastro
                </Link>
              </div>
            )}
            <Link
              href="/conta/nova-senha"
              className="mt-6 flex items-center gap-2 border-t border-profundo/10 pt-5 text-sm font-semibold text-marinho/70 hover:text-profundo"
            >
              <span className="icon text-lg!">key</span>
              Trocar senha
            </Link>
          </section>

          <section className="rounded-2xl border border-profundo/10 p-6">
            <h2 className="font-bold text-profundo">Falar com a Qualilan</h2>
            <p className="mt-1 text-sm text-marinho/60">{site.hours}.</p>
            <a
              href={whatsappLink("Olá, Qualilan! Sou cliente pelo site e preciso de ajuda.")}
              target="_blank"
              rel="noopener"
              className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#128C7E] hover:underline"
            >
              <WhatsAppIcon className="size-[18px]" />
              WhatsApp {site.whatsappLabel}
            </a>
            <a
              href={`tel:+55${site.sac.replace(/\D/g, "")}`}
              className="mt-3 flex items-center gap-2 text-sm font-semibold text-profundo hover:underline"
            >
              <span className="icon text-lg!">call</span>
              SAC {site.sac}
            </a>
          </section>
        </aside>
      </div>
    </AccountShell>
  );
}

export default function AccountPage({ searchParams }: PageProps<"/conta">) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Account searchParams={searchParams} />
    </Suspense>
  );
}
