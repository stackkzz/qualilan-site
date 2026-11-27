import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/lib/catalog";
import Image from "next/image";
import { AddToQuote } from "./quote-cart";

// Markdown simples dos posts, convertido direto em elementos React (nada de HTML cru: sem risco de script injetado).
// Suporta: ## e ### títulos, parágrafos, listas (- e 1.), imagens ![alt](url), **negrito**, *itálico*, [link](url)
// e o bloco [[produtos: slug-1, slug-2]], que mostra cards do catálogo com o botão de orçamento.

type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "img"; alt: string; src: string }
  | { type: "products"; slugs: string[] };

export function parseBlocks(source: string): Block[] {
  return source
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const products = chunk.match(/^\[\[produtos:\s*(.+?)\]\]$/);
      if (products) return { type: "products", slugs: products[1].split(",").map((s) => s.trim()).filter(Boolean) };
      const img = chunk.match(/^!\[(.*?)\]\((\S+?)\)$/);
      if (img) return { type: "img", alt: img[1], src: img[2] };
      if (chunk.startsWith("### ")) return { type: "h3", text: chunk.slice(4) };
      if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3) };
      const lines = chunk.split("\n");
      if (lines.every((l) => /^- /.test(l))) return { type: "ul", items: lines.map((l) => l.slice(2)) };
      if (lines.every((l) => /^\d+\. /.test(l))) return { type: "ol", items: lines.map((l) => l.replace(/^\d+\. /, "")) };
      return { type: "p", text: lines.join(" ") };
    });
}

// Só links do próprio site ou http(s): bloqueia javascript: e afins.
function safeHref(url: string) {
  return url.startsWith("/") || /^https?:\/\//.test(url) ? url : null;
}

export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((\S+?)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1]) out.push(<strong key={key}>{inline(m[1])}</strong>);
    else if (m[2]) out.push(<em key={key}>{inline(m[2])}</em>);
    else {
      const href = safeHref(m[4]);
      if (!href) out.push(m[3]);
      else if (href.startsWith("/"))
        out.push(
          <Link key={key} href={href}>
            {m[3]}
          </Link>,
        );
      else
        out.push(
          <a key={key} href={href} target="_blank" rel="noopener">
            {m[3]}
          </a>,
        );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source, products = [] }: { source: string; products?: Product[] }) {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return (
    <>
      {parseBlocks(source).map((b, i) => {
        switch (b.type) {
          case "h2":
            return <h2 key={i}>{inline(b.text)}</h2>;
          case "h3":
            return <h3 key={i}>{inline(b.text)}</h3>;
          case "p":
            return <p key={i}>{inline(b.text)}</p>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it)}</li>
                ))}
              </ol>
            );
          case "img": {
            const src = safeHref(b.src);
            if (!src) return null;
            return (
              <figure key={i}>
                {/* Imagens do post podem vir de qualquer endereço colado no painel: <img> comum evita exigir domínio liberado no next/image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={b.alt} loading="lazy" className="w-full rounded-2xl" />
                {b.alt && <figcaption>{b.alt}</figcaption>}
              </figure>
            );
          }
          case "products": {
            const list = b.slugs.map((s) => bySlug.get(s)).filter((p): p is Product => !!p);
            if (list.length === 0) return null;
            return (
              <div key={i} className="grid gap-3 py-4">
                {list.map((p) => (
                  <PostProduct key={p.slug} product={p} />
                ))}
              </div>
            );
          }
        }
      })}
    </>
  );
}

// Produto citado no artigo: card horizontal com foto, marca, nome e botão de orçamento.
function PostProduct({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-profundo/10 bg-white p-3 pr-4 text-base leading-snug">
      <Link href={`/produto/${product.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-offwhite">
        {product.image && (
          <Image src={product.image} alt="" fill sizes="80px" className="object-contain p-2 mix-blend-multiply" />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        {product.brand && <span className="block text-xs font-semibold text-royal">{product.brand}</span>}
        <Link href={`/produto/${product.slug}`} className="mt-0.5 line-clamp-2 text-sm text-marinho/80 hover:text-royal">
          {product.name}
        </Link>
      </div>
      <div className="shrink-0">
        <AddToQuote product={{ slug: product.slug, name: product.name, sku: product.sku, image: product.image }} size="sm" />
      </div>
    </div>
  );
}
