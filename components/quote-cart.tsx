"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { categories, site } from "@/lib/site";
import { WhatsAppIcon, whatsappButtonClass } from "./whatsapp-icon";

export type QuoteItem = { slug: string; name: string; sku: string | null; image?: string | null; qty: number };

type QuoteState = {
  items: QuoteItem[];
  count: number;
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

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

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
    count: items.reduce((n, i) => n + i.qty, 0),
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
      <FloatingQuoteButton />
      <QuoteDialog ref={dialogRef} />
    </QuoteContext.Provider>
  );
}

function QtyStepper({ item }: { item: QuoteItem }) {
  const { setQty, remove } = useQuote();
  const btn = "grid size-8 place-items-center rounded-md text-profundo hover:bg-white disabled:opacity-30";
  return (
    <div className="flex items-center rounded-lg bg-offwhite p-0.5">
      <button
        type="button"
        className={btn}
        aria-label={item.qty === 1 ? `Remover ${item.name}` : `Diminuir quantidade de ${item.name}`}
        onClick={() => (item.qty === 1 ? remove(item.slug) : setQty(item.slug, item.qty - 1))}
      >
        <span className="icon text-lg!">{item.qty === 1 ? "delete" : "remove"}</span>
      </button>
      <label className="sr-only" htmlFor={`qty-${item.slug}`}>
        Quantidade de {item.name}
      </label>
      <input
        id={`qty-${item.slug}`}
        type="number"
        inputMode="numeric"
        min={1}
        max={9999}
        value={item.qty}
        onChange={(e) => setQty(item.slug, e.target.valueAsNumber)}
        className="w-12 bg-transparent text-center text-sm font-semibold tabular-nums text-profundo outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={btn} aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => setQty(item.slug, item.qty + 1)}>
        <span className="icon text-lg!">add</span>
      </button>
    </div>
  );
}

function QuoteDialog({ ref }: { ref: React.RefObject<HTMLDialogElement | null> }) {
  const { items, count, remove, clear } = useQuote();
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(buildQuoteMessage(items))}`;
  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="quote-title"
      onClick={(e) => e.target === e.currentTarget && close()}
      className="drawer m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-white p-0 text-marinho backdrop:bg-marinho/60"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-profundo/10 px-6 py-5">
          <div>
            <h2 id="quote-title" className="text-xl font-bold text-profundo">
              Sua lista
            </h2>
            <p className="text-sm text-marinho/55">
              {items.length ? `${plural(items.length, "produto", "produtos")}, ${plural(count, "item", "itens")}` : "Nenhum produto ainda"}
            </p>
          </div>
          <button type="button" onClick={close} className="grid size-10 place-items-center rounded-full hover:bg-offwhite" aria-label="Fechar">
            <span className="icon">close</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="relative grid size-24 place-items-center rounded-full bg-royal/8 text-royal">
              <span className="absolute inset-0 rounded-full border-2 border-dashed border-royal/20" />
              <span className="icon text-5xl!">shopping_cart</span>
            </span>
            <p className="mt-6 text-lg font-semibold text-profundo">Sua lista está vazia</p>
            <p className="mt-2 text-sm leading-relaxed text-marinho/60">
              Adicione produtos do catálogo e envie tudo de uma vez para o nosso time de vendas.
            </p>
            <Link
              href="/catalogo"
              onClick={close}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-profundo px-5 py-3 text-sm font-semibold text-white hover:bg-royal"
            >
              <span className="icon text-xl!">grid_view</span>
              Explorar o catálogo
            </Link>
            <ul className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
              {categories.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/catalogo/${c.slug}`}
                    onClick={close}
                    className="inline-flex items-center gap-1.5 rounded-full border border-profundo/10 px-3 py-1.5 text-marinho/75 hover:border-royal hover:text-royal"
                  >
                    <span className="icon text-base!">{c.icon}</span>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-profundo/10 overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.slug} className="flex gap-4 py-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-offwhite">
                    {i.image ? (
                      <Image src={i.image} alt="" fill sizes="64px" className="object-contain p-1.5 mix-blend-multiply" />
                    ) : (
                      <span className="icon absolute inset-0 grid place-items-center text-royal/40">inventory_2</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[13px] font-medium leading-snug text-profundo">{i.name}</p>
                    {i.sku && <p className="mt-0.5 text-xs text-marinho/50">Cód. {i.sku}</p>}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QtyStepper item={i} />
                      <button type="button" onClick={() => remove(i.slug)} className="text-xs text-marinho/50 hover:text-red-700">
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-profundo/10 px-6 py-5">
              <a
                href={href}
                target="_blank"
                rel="noopener"
                className={`w-full rounded-xl ${whatsappButtonClass}`}
              >
                <WhatsAppIcon className="size-[22px]" />
                Fazer orçamento no WhatsApp
              </a>
              <p className="text-center text-xs text-marinho/55">Atendimento: {site.hours.toLowerCase()}.</p>
              <button type="button" onClick={clear} className="w-full text-xs text-marinho/50 hover:text-marinho">
                Limpar lista
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

// Botão do cabeçalho: só o carrinho, com o número de itens num selo.
export function QuoteCartButton() {
  const { count, open } = useQuote();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={count ? `Abrir lista de orçamento, ${plural(count, "item", "itens")}` : "Abrir lista de orçamento"}
      className="relative grid size-11 place-items-center rounded-xl border border-profundo/10 text-profundo transition-colors hover:border-profundo/30 hover:bg-offwhite"
    >
      <span className={`icon text-[1.6rem]! ${count ? "icon-fill" : ""}`}>shopping_cart</span>
      {count > 0 && (
        <span
          key={count}
          aria-hidden
          className="bump absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-laranja px-1 text-[11px] font-bold tabular-nums text-profundo ring-2 ring-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

// Aparece no canto da tela quando há itens na lista: atalho direto para fechar o orçamento.
function FloatingQuoteButton() {
  const { count, open } = useQuote();
  if (!count) return null;
  return (
    <button
      type="button"
      onClick={open}
      className="float-in fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full bg-profundo py-2 pl-2 pr-5 text-sm font-semibold text-white shadow-[0_20px_40px_-12px_rgba(18,23,68,0.6)] transition-colors hover:bg-royal"
    >
      <span key={count} className="bump grid size-9 place-items-center rounded-full bg-laranja text-profundo tabular-nums">
        {count > 99 ? "99+" : count}
      </span>
      Fazer meu orçamento
    </button>
  );
}

export function AddToQuote({
  product,
  size = "md",
}: {
  product: { slug: string; name: string; sku: string | null; image?: string | null };
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
      <span className="icon text-xl!">{justAdded ? "check" : inList ? "shopping_cart" : "add_shopping_cart"}</span>
      <span aria-live="polite">
        {justAdded ? "Adicionado" : inList ? `Na lista (${inList.qty})` : size === "sm" ? "Adicionar" : "Adicionar à lista"}
      </span>
    </button>
  );
}
