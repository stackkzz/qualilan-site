"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/lib/site";

export type QuoteItem = { slug: string; name: string; sku: string | null; qty: number };

type QuoteState = {
  items: QuoteItem[];
  add: (item: Omit<QuoteItem, "qty">) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
};

const STORAGE_KEY = "qualilan-orcamento";
const QuoteContext = createContext<QuoteState | null>(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote precisa estar dentro de <QuoteProvider>");
  return ctx;
}

export function buildQuoteMessage(items: QuoteItem[]) {
  const lines = items.map((i) => `• ${i.qty}x ${i.name}${i.sku ? ` (cód. ${i.sku})` : ""}`);
  return ["Olá, Qualilan! Gostaria de um orçamento destes itens:", "", ...lines, "", "Enviado pelo site."].join("\n");
}

function readStorage(): QuoteItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((i) => typeof i?.slug === "string" && typeof i?.name === "string" && i.qty > 0)
      : [];
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage só existe no cliente
    setItems(readStorage());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const state: QuoteState = {
    items,
    add: (item) =>
      setItems((prev) =>
        prev.some((i) => i.slug === item.slug)
          ? prev.map((i) => (i.slug === item.slug ? { ...i, qty: i.qty + 1 } : i))
          : [...prev, { ...item, qty: 1 }],
      ),
    setQty: (slug, qty) =>
      setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.min(9999, qty || 1)) } : i))),
    remove: (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug)),
    clear: () => setItems([]),
    open: () => dialogRef.current?.showModal(),
  };

  return (
    <QuoteContext.Provider value={state}>
      {children}
      <QuoteDialog ref={dialogRef} />
    </QuoteContext.Provider>
  );
}

function QuoteDialog({ ref }: { ref: React.RefObject<HTMLDialogElement | null> }) {
  const { items, setQty, remove, clear } = useQuote();
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(buildQuoteMessage(items))}`;

  return (
    <dialog
      ref={ref}
      aria-labelledby="quote-title"
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-white p-0 text-marinho backdrop:bg-marinho/60"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-profundo/10 px-6 py-5">
          <h2 id="quote-title" className="text-xl font-bold text-profundo">
            Sua lista de orçamento
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="grid size-10 place-items-center rounded-full hover:bg-offwhite"
            aria-label="Fechar"
          >
            <span className="icon">close</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="icon text-5xl! text-royal/40">playlist_add</span>
            <p className="font-medium text-profundo">Sua lista está vazia.</p>
            <p className="text-sm text-marinho/60">
              Use “Adicionar ao orçamento” nos produtos do catálogo para montar sua lista.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-profundo/10 overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.slug} className="flex gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{i.name}</p>
                    {i.sku && <p className="mt-1 text-xs text-marinho/50">Cód. {i.sku}</p>}
                    <button
                      type="button"
                      onClick={() => remove(i.slug)}
                      className="mt-2 text-xs font-medium text-royal underline underline-offset-2 hover:text-profundo"
                    >
                      Remover
                    </button>
                  </div>
                  <label className="sr-only" htmlFor={`qty-${i.slug}`}>
                    Quantidade de {i.name}
                  </label>
                  <input
                    id={`qty-${i.slug}`}
                    type="number"
                    min={1}
                    max={9999}
                    value={i.qty}
                    onChange={(e) => setQty(i.slug, e.target.valueAsNumber)}
                    className="h-10 w-20 shrink-0 rounded-lg border border-profundo/20 px-2 text-center"
                  />
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-profundo/10 px-6 py-5">
              <a
                href={href}
                target="_blank"
                rel="noopener"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-laranja px-6 py-3.5 font-semibold text-profundo transition-colors hover:bg-amarelo"
              >
                <span className="icon text-xl!">chat</span>
                Enviar pelo WhatsApp
              </a>
              <button
                type="button"
                onClick={clear}
                className="w-full text-sm text-marinho/60 hover:text-marinho"
              >
                Limpar lista
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

export function QuoteCartButton() {
  const { items, open } = useQuote();
  const count = items.reduce((n, i) => n + i.qty, 0);
  return (
    <button
      type="button"
      onClick={open}
      className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-laranja px-4 py-2.5 text-sm font-semibold text-profundo transition-colors hover:bg-amarelo sm:px-5"
    >
      <span className="icon text-xl!">request_quote</span>
      <span className="hidden sm:inline">Orçamento</span>
      {count > 0 && (
        <span className="grid min-w-6 place-items-center rounded-full bg-profundo px-1.5 text-xs text-white">
          <span className="sr-only">itens na lista: </span>
          {count}
        </span>
      )}
    </button>
  );
}

export function AddToQuote({
  product,
  size = "md",
}: {
  product: { slug: string; name: string; sku: string | null };
  size?: "sm" | "md";
}) {
  const { add, items } = useQuote();
  const [justAdded, setJustAdded] = useState(false);
  const inList = items.find((i) => i.slug === product.slug);

  return (
    <button
      type="button"
      onClick={() => {
        add(product);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
      }}
      aria-label={size === "sm" ? `Adicionar ${product.name} ao orçamento` : undefined}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors ${
        size === "sm"
          ? "w-full border border-royal/30 px-4 py-2 text-sm text-royal hover:border-royal hover:bg-royal hover:text-white"
          : "bg-royal px-6 py-3.5 text-white hover:bg-profundo"
      }`}
    >
      <span className="icon text-xl!">{justAdded ? "check" : "playlist_add"}</span>
      <span aria-live="polite">
        {justAdded
          ? "Adicionado"
          : inList
            ? `Na lista (${inList.qty})`
            : size === "sm"
              ? "Adicionar"
              : "Adicionar ao orçamento"}
      </span>
    </button>
  );
}
