"use client";

import { useEffect } from "react";

const STORAGE_KEY = "qualilan-orcamento"; // mesma chave da lista de orçamento (quote-cart.tsx)

function send(data: Record<string, unknown>) {
  const body = JSON.stringify({ path: location.pathname, ...data });
  if (!navigator.sendBeacon?.("/api/evento", body)) fetch("/api/evento", { method: "POST", body, keepalive: true });
}

// Um ouvinte só para o site inteiro: cliques em links do WhatsApp e buscas enviadas.
// A origem do clique sai do atributo data-track do link; sem ele, conta como contato geral.
export function EventTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="wa.me/"]');
      if (!a) return;
      const kind = a.dataset.track;
      if (kind === "lista") {
        let items: unknown = [];
        try {
          items = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        } catch {}
        send({ type: "whatsapp_lista", items });
      } else if (kind === "item") {
        send({ type: "whatsapp_item", items: [{ slug: a.dataset.slug, qty: 1 }] });
      } else {
        send({ type: "whatsapp_contato" });
      }
    };
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form.getAttribute("role") !== "search") return;
      const q = new FormData(form).get("q");
      if (typeof q === "string" && q.trim()) send({ type: "busca", query: q });
    };
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("submit", onSubmit, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("submit", onSubmit, { capture: true });
    };
  }, []);
  return null;
}
