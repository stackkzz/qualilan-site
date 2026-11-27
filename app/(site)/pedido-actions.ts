"use server";

import { createSupabasePublicClient } from "@/lib/supabase/server";

export type RequestState = { ok?: boolean; error?: string } | undefined;

type Item = { slug: string; name: string; sku: string | null; qty: number };

const field = (fd: FormData, name: string, max: number) => String(fd.get(name) ?? "").trim().slice(0, max);

// Pedido de orçamento por e-mail: grava no Supabase (o painel lista em /admin/pedidos).
export async function sendQuoteRequest(_: RequestState, fd: FormData): Promise<RequestState> {
  // Campo escondido que só robôs preenchem.
  if (field(fd, "website", 200)) return { ok: true };

  const name = field(fd, "name", 120);
  const email = field(fd, "email", 200);
  if (name.length < 2) return { error: "Informe o seu nome." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Informe um e-mail válido." };

  let items: Item[];
  try {
    const raw = JSON.parse(field(fd, "items", 60000)) as unknown;
    if (!Array.isArray(raw)) throw new Error();
    items = raw.slice(0, 200).map((i) => ({
      slug: String(i.slug).slice(0, 120),
      name: String(i.name).slice(0, 300),
      sku: i.sku ? String(i.sku).slice(0, 60) : null,
      qty: Math.min(9999, Math.max(1, Math.round(Number(i.qty) || 1))),
    }));
  } catch {
    return { error: "Não foi possível ler a lista. Recarregue a página e tente de novo." };
  }
  if (items.length === 0) return { error: "Adicione ao menos um produto à lista." };

  const { error } = await createSupabasePublicClient()
    .from("quote_requests")
    .insert({
      name,
      email,
      company: field(fd, "company", 160) || null,
      phone: field(fd, "phone", 40) || null,
      message: field(fd, "message", 2000) || null,
      items,
    });
  if (error) return { error: "Não foi possível enviar agora. Tente de novo ou use o WhatsApp." };
  return { ok: true };
}
