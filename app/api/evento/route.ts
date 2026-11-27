import { createSupabasePublicClient } from "@/lib/supabase/server";

// Recebe eventos anônimos do site (navigator.sendBeacon) para as métricas do painel.
// Nada de dado pessoal: só tipo, página, termo buscado e os itens da lista (slug e quantidade).
// shortcut: sem limite de taxa por IP; se aparecer abuso, colocar o Vercel Firewall ou BotID na frente.
const TYPES = new Set(["whatsapp_lista", "whatsapp_item", "whatsapp_contato", "busca"]);

export async function POST(request: Request) {
  let body: { type?: unknown; path?: unknown; query?: unknown; items?: unknown };
  try {
    body = JSON.parse((await request.text()).slice(0, 20000));
  } catch {
    return new Response(null, { status: 400 });
  }
  const type = String(body.type ?? "");
  if (!TYPES.has(type)) return new Response(null, { status: 400 });

  const items = Array.isArray(body.items)
    ? body.items.slice(0, 200).map((i: { slug?: unknown; qty?: unknown }) => ({
        slug: String(i?.slug ?? "").slice(0, 120),
        qty: Math.min(9999, Math.max(1, Math.round(Number(i?.qty) || 1))),
      }))
    : null;

  await createSupabasePublicClient()
    .from("site_events")
    .insert({
      type,
      path: String(body.path ?? "").slice(0, 300) || null,
      query: String(body.query ?? "").trim().toLowerCase().slice(0, 120) || null,
      items,
    });
  return new Response(null, { status: 204 });
}
