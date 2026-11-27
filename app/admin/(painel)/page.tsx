import Link from "next/link";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { PageBody, PageHeader, panelCard } from "../ui";

const WEEK = 7 * 24 * 60 * 60 * 1000;

// Tudo o que o painel precisa mostrar na entrada, numa ida ao banco (fora do render: usa a hora atual).
async function loadSummary() {
  const { supabase } = await requireAdmin();
  const since = new Date(Date.now() - WEEK).toISOString();
  const [newRequests, pendingNames, quotes, products, drafts, latest] = await Promise.all([
    supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "novo"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("name_reviewed", false),
    supabase
      .from("site_events")
      .select("id", { count: "exact", head: true })
      .in("type", ["whatsapp_lista", "whatsapp_item", "pedido_email"])
      .gte("created_at", since),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("quote_requests").select("id, name, company, created_at, status, items").order("created_at", { ascending: false }).limit(5),
  ]);
  return {

    newRequests: newRequests.count ?? 0,
    pendingNames: pendingNames.count ?? 0,
    quotes: quotes.count ?? 0,
    products: products.count ?? 0,
    drafts: drafts.count ?? 0,
    latest: latest.data ?? [],
  };
}

async function Dashboard() {
  const s = await loadSummary();
  const cards = [
    { label: "Pedidos novos por e-mail", value: s.newRequests, href: "/admin/pedidos", icon: "mail", alert: s.newRequests > 0 },
    { label: "Orçamentos nos últimos 7 dias", value: s.quotes, href: "/admin/metricas", icon: "monitoring", alert: false },
    { label: "Nomes para revisar", value: s.pendingNames, href: "/admin/revisao", icon: "spellcheck", alert: s.pendingNames > 0 },
    { label: "Produtos no site", value: s.products, href: "/admin/produtos", icon: "inventory_2", alert: false },
  ];

  return (
    <PageBody>
      <PageHeader title="Início" description="O que precisa da sua atenção hoje no site da Qualilan." />

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className={`${panelCard} group flex h-full flex-col p-5 transition-colors hover:border-profundo/30`}>
              <span className="flex items-center justify-between">
                <span className={`icon text-2xl! ${c.alert ? "text-laranja" : "text-royal"}`}>{c.icon}</span>
                {c.alert && <span className="size-2 rounded-full bg-laranja" aria-label="Precisa de atenção" />}
              </span>
              <span className="mt-4 text-3xl font-bold tabular-nums text-profundo">{c.value}</span>
              <span className="mt-1 text-sm text-marinho/60 group-hover:text-profundo">{c.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className={`${panelCard} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-profundo">Últimos pedidos por e-mail</h2>
            <Link href="/admin/pedidos" className="text-sm font-semibold text-royal hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="divide-y divide-profundo/10">
            {s.latest.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium text-profundo">
                    {r.name}
                    {r.company && <span className="font-normal text-marinho/55">, {r.company}</span>}
                  </span>
                  <span className="text-marinho/50">
                    {(r.items as unknown[]).length} itens,{" "}
                    {new Date(r.created_at).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                  </span>
                </span>
                {r.status === "novo" && (
                  <span className="shrink-0 rounded-full bg-laranja/15 px-2.5 py-1 text-xs font-semibold text-[#9A5B00]">Novo</span>
                )}
              </li>
            ))}
            {s.latest.length === 0 && (
              <li className="py-6 text-center text-sm text-marinho/50">
                Nenhum pedido ainda. Eles chegam pelo “Prefere receber por e-mail?” da lista de orçamento.
              </li>
            )}
          </ul>
        </section>

        <section className={`${panelCard} p-5`}>
          <h2 className="mb-3 font-semibold text-profundo">Atalhos</h2>
          <ul className="space-y-1 text-sm">
            {[
              { href: "/admin/produtos/novo", icon: "add_box", label: "Novo produto" },
              { href: "/admin/blog/novo", icon: "post_add", label: "Novo artigo" },
              { href: "/admin/blog", icon: "edit_note", label: s.drafts ? `Rascunhos do blog (${s.drafts})` : "Artigos do blog" },
            ].map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="flex items-center gap-3 rounded-lg px-2 py-2 text-marinho/75 hover:bg-offwhite hover:text-profundo">
                  <span className="icon text-xl! text-royal">{a.icon}</span>
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageBody>
  );
}

export default function AdminHome() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Dashboard />
    </Suspense>
  );
}
