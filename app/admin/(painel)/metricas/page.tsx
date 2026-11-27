import Link from "next/link";
import { Suspense } from "react";
import { PageBody, PageHeader, panelCard } from "@/app/admin/ui";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { getCategory, searchProducts, toProduct } from "@/lib/catalog";

type Event = { type: string; query: string | null; items: { slug: string; qty: number }[] | null; created_at: string };

const DAY = 24 * 60 * 60 * 1000;
const QUOTE_TYPES = new Set(["whatsapp_lista", "whatsapp_item", "pedido_email"]);

function count<T>(list: T[], key: (t: T) => string | null | undefined) {
  const m = new Map<string, number>();
  for (const t of list) {
    const k = key(t);
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

// Busca e cálculo fora do componente (o React exige render puro; aqui usamos a hora atual).
async function loadMetrics() {
  const { supabase } = await requireAdmin();
  const since = new Date(Date.now() - 56 * DAY).toISOString();
  const [{ data: events, error }, { data: rows }] = await Promise.all([
    supabase.from("site_events").select("type, query, items, created_at").gte("created_at", since).order("created_at").limit(20000),
    supabase.from("products").select("id, slug, sku, name, category, brand, image_url, in_stock, description, mfr_code"),
  ]);
  if (error) throw new Error(error.message);
  const list = (events ?? []) as Event[];
  const products = (rows ?? []).map(toProduct);
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const now = Date.now();
  const inDays = (e: Event, d: number) => now - new Date(e.created_at).getTime() <= d * DAY;
  const cards = [
    { label: "Orçamentos pelo WhatsApp", types: ["whatsapp_lista", "whatsapp_item"] },
    { label: "Pedidos por e-mail", types: ["pedido_email"] },
    { label: "Contatos pelo WhatsApp", types: ["whatsapp_contato"] },
    { label: "Buscas no catálogo", types: ["busca"] },
  ].map((c) => ({
    ...c,
    week: list.filter((e) => c.types.includes(e.type) && inDays(e, 7)).length,
    month: list.filter((e) => c.types.includes(e.type) && inDays(e, 30)).length,
  }));

  // Orçamentos por semana (8 semanas), da mais antiga para a mais recente.
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const end = now - (7 - i) * 7 * DAY;
    const start = end - 7 * DAY;
    const n = list.filter((e) => {
      const t = new Date(e.created_at).getTime();
      return QUOTE_TYPES.has(e.type) && t > start && t <= end;
    }).length;
    return { label: new Date(start + DAY).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }), n };
  });
  const maxWeek = Math.max(1, ...weeks.map((w) => w.n));

  const quoted = list.filter((e) => QUOTE_TYPES.has(e.type) && inDays(e, 30)).flatMap((e) => e.items ?? []);
  const topProducts = count(quoted, (i) => i.slug).slice(0, 10);
  const topCategories = count(quoted, (i) => bySlug.get(i.slug)?.category).slice(0, 6);
  const searches = list.filter((e) => e.type === "busca" && inDays(e, 30));
  const topSearches = count(searches, (e) => e.query).slice(0, 10);
  const notFound = topSearches.filter(([q]) => searchProducts(products, { q }).length === 0);
  return { cards, weeks, maxWeek, topProducts, topCategories, topSearches, notFound, bySlug };
}

async function Metrics() {
  const { cards, weeks, maxWeek, topProducts, topCategories, topSearches, notFound, bySlug } = await loadMetrics();
  return (
    <>
      <PageBody>
        <PageHeader title="Métricas do site" description="Últimos 7 e 30 dias. Contamos cliques e buscas, sem dados pessoais dos visitantes." />
        <div className="space-y-6">

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <li key={c.label} className={`${panelCard} p-5`}>
              <p className="text-sm text-marinho/60">{c.label}</p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-profundo">{c.week}</p>
              <p className="mt-1 text-sm text-marinho/55">
                nos últimos 7 dias, {c.month} em 30 dias
              </p>
            </li>
          ))}
        </ul>

        <section className={`${panelCard} p-6`}>
          <h2 className="font-semibold text-profundo">Orçamentos por semana</h2>
          <p className="text-sm text-marinho/55">WhatsApp (lista e item) e e-mail.</p>
          <div
            className="mt-6 flex h-40 items-end gap-3"
            role="img"
            aria-label={weeks.map((w) => `semana de ${w.label}: ${w.n}`).join(", ")}
          >
            {weeks.map((w) => (
              <div key={w.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-semibold tabular-nums text-profundo">{w.n}</span>
                <div className="w-full rounded-t-md bg-royal" style={{ height: `${(w.n / maxWeek) * 75}%`, minHeight: w.n ? 4 : 1 }} />
                <span className="text-[11px] text-marinho/50">{w.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className={`${panelCard} p-6`}>
            <h2 className="font-semibold text-profundo">Produtos mais orçados (30 dias)</h2>
            <ol className="mt-4 space-y-2 text-sm">
              {topProducts.map(([slug, n]) => (
                <li key={slug} className="flex justify-between gap-4">
                  <Link href={`/produto/${slug}`} target="_blank" className="truncate text-royal hover:underline">
                    {bySlug.get(slug)?.name ?? slug}
                  </Link>
                  <span className="shrink-0 font-semibold tabular-nums">{n}</span>
                </li>
              ))}
              {topProducts.length === 0 && <li className="text-marinho/50">Ainda sem orçamentos registrados.</li>}
            </ol>
            {topCategories.length > 0 && (
              <p className="mt-5 border-t border-profundo/10 pt-4 text-sm text-marinho/70">
                <span className="font-semibold text-profundo">Categorias:</span>{" "}
                {topCategories.map(([c, n]) => `${getCategory(c)?.name ?? c} (${n})`).join(", ")}
              </p>
            )}
          </section>

          <section className={`${panelCard} p-6`}>
            <h2 className="font-semibold text-profundo">O que mais buscam (30 dias)</h2>
            <ol className="mt-4 space-y-2 text-sm">
              {topSearches.map(([q, n]) => (
                <li key={q} className="flex justify-between gap-4">
                  <Link href={`/catalogo?q=${encodeURIComponent(q)}`} target="_blank" className="truncate text-royal hover:underline">
                    {q}
                  </Link>
                  <span className="shrink-0 font-semibold tabular-nums">{n}</span>
                </li>
              ))}
              {topSearches.length === 0 && <li className="text-marinho/50">Ainda sem buscas registradas.</li>}
            </ol>
            {notFound.length > 0 && (
              <div className="mt-5 rounded-xl bg-amarelo/20 p-4 text-sm">
                <p className="font-semibold text-profundo">Buscaram e não encontraram</p>
                <p className="mt-1 text-marinho/75">
                  {notFound.map(([q]) => q).join(", ")}. Vale cadastrar esses itens ou revisar os nomes.
                </p>
              </div>
            )}
          </section>
        </div>
        </div>
      </PageBody>
    </>
  );
}

export default function AdminMetricsPage() {
  return (
    <Suspense
      fallback={<PageLoader />}
    >
      <Metrics />
    </Suspense>
  );
}
