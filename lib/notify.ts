// Aviso por e-mail para a equipe a cada pedido de orçamento novo, via API do Resend (sem biblioteca).
// Liga sozinho quando RESEND_API_KEY e NOTIFY_EMAIL estão configuradas; sem elas, não faz nada.
// NOTIFY_FROM precisa ser um remetente de domínio verificado no Resend. Sem domínio, o remetente de teste
// "onboarding@resend.dev" só entrega para o e-mail dono da conta do Resend.
type Item = { name: string; sku: string | null; qty: number };

export async function notifyNewRequest(r: { name: string; company: string; email: string; phone: string; items: Item[] }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;

  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const lines = r.items.map((i) => `• ${i.qty}x ${i.name}${i.sku ? ` (cód. ${i.sku})` : ""}`);
  const text = [
    `Novo pedido de orçamento pelo site.`,
    ``,
    `Nome: ${r.name}`,
    r.company ? `Empresa: ${r.company}` : null,
    `E-mail: ${r.email}`,
    r.phone ? `Telefone: ${r.phone}` : null,
    ``,
    `Itens (${r.items.length}):`,
    ...lines,
    ``,
    host ? `Ver no painel: https://${host}/admin/pedidos` : "",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || "Site Qualilan <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      reply_to: r.email,
      subject: `Novo orçamento: ${r.name}${r.company ? `, ${r.company}` : ""} (${r.items.length} ${r.items.length === 1 ? "item" : "itens"})`,
      text,
    }),
  });
  if (!res.ok) console.error("Aviso de pedido não enviado:", res.status, await res.text());
}
