"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { categories, site } from "@/lib/site";
import { logWhatsappQuote } from "@/app/(site)/conta/actions";
import { EmailQuoteForm } from "./email-quote-form";
import { WhatsAppIcon, whatsappButtonClass } from "./whatsapp-icon";

export type QuoteItem = { slug: string; name: string; sku: string | null; image?: string | null; qty: number };

type QuoteState = {
  items: QuoteItem[];
  count: number;
  add: (item: Omit<QuoteItem, "qty">) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  restore: (items: QuoteItem[]) => void;
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
    restore: setItems,
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
  const { setQty } = useQuote();
  const btn = "grid size-8 place-items-center rounded-md text-profundo hover:bg-white disabled:opacity-30";
  return (
    <div className="flex items-center rounded-lg bg-offwhite p-0.5">
      <button
        type="button"
        className={btn}
        aria-label={`Diminuir quantidade de ${item.name}`}
        disabled={item.qty <= 1}
        onClick={() => setQty(item.slug, item.qty - 1)}
      >
        <span className="icon text-lg!">remove</span>
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
  const { items, count, clear, restore } = useQuote();
  // Depois do envio a lista esvazia; guardamos a última para "Recuperar lista" (WhatsApp fechado sem enviar).
  const [sent, setSent] = useState<{ channel: "whatsapp" | "email"; items: QuoteItem[] } | null>(null);
  const finish = (channel: "whatsapp" | "email") => {
    setSent({ channel, items });
    clear();
  };
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

        {items.length === 0 && sent ? (
          <div role="status" className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-700">
              <span className="icon icon-fill text-5xl!">check_circle</span>
            </span>
            <p className="mt-6 text-lg font-semibold text-profundo">
              {sent.channel === "email" ? "Pedido enviado" : "Pedido aberto no WhatsApp"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-marinho/60">
              {sent.channel === "email"
                ? "Nossa equipe responde por e-mail no horário de atendimento."
                : "Confira a mensagem no WhatsApp e toque em enviar. Nossa equipe responde por lá."}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <Link
                href="/catalogo"
                onClick={close}
                className="inline-flex items-center gap-2 rounded-lg bg-profundo px-5 py-3 text-sm font-semibold text-white hover:bg-royal"
              >
                <span className="icon text-xl!">grid_view</span>
                Continuar no catálogo
              </Link>
              <button
                type="button"
                onClick={() => {
                  restore(sent.items);
                  setSent(null);
                }}
                className="text-sm font-semibold text-royal hover:underline"
              >
                Recuperar a lista
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
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
                      <RemoveItem item={i} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-profundo/10 px-6 py-5">
              <a
                href={href}
                data-track="lista"
                onClick={() => {
                  void logWhatsappQuote(items.map(({ slug, name, sku, qty }) => ({ slug, name, sku, qty })));
                  finish("whatsapp");
                }}
                target="_blank"
                rel="noopener"
                className={`w-full ${whatsappButtonClass}`}
              >
                <WhatsAppIcon className="size-[22px]" />
                Fazer orçamento no WhatsApp
              </a>
              <p className="text-center text-xs text-marinho/55">Atendimento: {site.hours.toLowerCase()}.</p>
              <EmailQuoteForm onSent={() => finish("email")} />
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

// Remover item da lista: lixeira que pede confirmação no próprio lugar ("Remover? Sim / Não").
function RemoveItem({ item }: { item: QuoteItem }) {
  const { remove } = useQuote();
  const [asking, setAsking] = useState(false);
  if (asking) {
    return (
      <div className="flex items-center gap-1 text-xs" role="group" aria-label={`Confirmar remoção de ${item.name}`}>
        <span className="mr-1 text-marinho/60">Remover?</span>
        <button type="button" onClick={() => remove(item.slug)} className="rounded-md bg-red-600 px-2.5 py-1.5 font-semibold text-white hover:bg-red-700">
          Sim
        </button>
        <button type="button" onClick={() => setAsking(false)} autoFocus className="rounded-md px-2.5 py-1.5 font-semibold text-marinho/70 hover:bg-offwhite">
          Não
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setAsking(true)}
      aria-label={`Remover ${item.name} da lista`}
      className="grid size-9 shrink-0 place-items-center rounded-lg text-marinho/40 transition-colors hover:bg-red-50 hover:text-red-600"
    >
      <span className="icon text-xl!">delete</span>
    </button>
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

// Botão flutuante do WhatsApp. Com itens na lista, abre a lista (onde fica o envio); vazio, abre a conversa direto.
function FloatingQuoteButton() {
  const { count, open } = useQuote();
  const cls =
    "quote-float float-in fixed bottom-4 right-4 z-30 grid size-12 place-items-center md:bottom-5 md:right-5 md:size-14 rounded-full bg-[#25D366] text-white shadow-[0_16px_32px_-10px_rgba(18,140,126,0.7)] transition-transform hover:scale-105";
  if (!count) {
    return (
      <a
        href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Olá, Qualilan! Gostaria de um orçamento.")}`}
        target="_blank"
        rel="noopener"
        aria-label="Conversar no WhatsApp"
        className={cls}
      >
        <WhatsAppIcon className="size-8" />
      </a>
    );
  }
  return (
    <button type="button" onClick={open} aria-label={`Ver lista de orçamento, ${plural(count, "item", "itens")}`} className={cls}>
      <WhatsAppIcon className="size-8" />
      <span
        key={count}
        aria-hidden
        className="bump absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-laranja px-1.5 text-xs font-bold tabular-nums text-profundo ring-2 ring-white"
      >
        {count > 99 ? "99+" : count}
      </span>
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

// "Compre junto": põe o produto atual e os sugeridos na lista de uma vez (quem já está na lista não duplica).
export function AddAllToQuote({ products }: { products: { slug: string; name: string; sku: string | null; image?: string | null }[] }) {
  const { add, items, open } = useQuote();
  const missing = products.filter((p) => !items.some((i) => i.slug === p.slug));
  return (
    <button
      type="button"
      onClick={() => {
        missing.forEach(add);
        open();
      }}
      disabled={missing.length === 0}
      className="inline-flex items-center gap-2 rounded-lg bg-royal px-5 py-3 font-semibold text-white transition-colors hover:bg-profundo disabled:cursor-default disabled:bg-emerald-700"
    >
      <span className="icon text-xl!">{missing.length ? "playlist_add" : "check"}</span>
      {missing.length ? `Adicionar ${missing.length === products.length ? "todos" : `os ${missing.length} que faltam`} à lista` : "Todos na lista"}
    </button>
  );
}
