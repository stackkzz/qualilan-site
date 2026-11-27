"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { Markdown } from "@/components/markdown";
import { Field, inputClass, panelCard } from "@/app/admin/ui";
import { deletePost, savePost } from "./actions";

export type EditablePost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_url: string | null;
  body: string;
  published: boolean;
  published_at: string;
};

// Atalhos da barra de formatação: o que entra antes e depois do texto selecionado.
const tools = [
  { label: "Título", icon: "title", before: "\n\n## ", after: "\n\n" },
  { label: "Negrito", icon: "format_bold", before: "**", after: "**" },
  { label: "Lista", icon: "format_list_bulleted", before: "\n\n- ", after: "" },
  { label: "Link", icon: "link", before: "[", after: "](https://)" },
  { label: "Produtos do catálogo", icon: "inventory_2", before: "\n\n[[produtos: ", after: "]]\n\n" },
];

export function PostForm({ post, categories }: { post?: EditablePost; categories: string[] }) {
  const [state, action, pending] = useActionState(savePost, undefined);
  const [cover, setCover] = useState<string | null>(post?.cover_url ?? null);
  const [body, setBody] = useState(post?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const area = useRef<HTMLTextAreaElement>(null);

  function apply(before: string, after: string) {
    const el = area.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const next = body.slice(0, s) + before + body.slice(s, e) + after + body.slice(e);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, e + before.length);
    });
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form action={action} className="space-y-5" id="post-form">
        {post && <input type="hidden" name="id" value={post.id} />}

        <section className={`${panelCard} space-y-5 p-5 md:p-6`}>
          <h2 className="text-sm font-semibold text-profundo">Artigo</h2>
        <Field label="Título" htmlFor="title">
          <input id="title" name="title" required minLength={3} maxLength={200} defaultValue={post?.title} className={inputClass} />
        </Field>

        <Field label="Resumo" htmlFor="excerpt" hint="Aparece no card do blog e no Google. Até 400 caracteres.">
          <textarea id="excerpt" name="excerpt" rows={2} maxLength={400} defaultValue={post?.excerpt} className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Categoria" htmlFor="category">
            <input
              id="category"
              name="category"
              list="category-list"
              maxLength={60}
              defaultValue={post?.category ?? ""}
              placeholder="Ex.: Fibra óptica"
              className={inputClass}
            />
            <datalist id="category-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Data de publicação" htmlFor="published_at">
            <input
              id="published_at"
              name="published_at"
              type="date"
              required
              defaultValue={post?.published_at.slice(0, 10) ?? today}
              className={inputClass}
            />
          </Field>
        </div>

        </section>

        <section className={`${panelCard} space-y-5 p-5 md:p-6`}>
          <h2 className="text-sm font-semibold text-profundo">Texto</h2>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="body" className="text-sm font-medium text-profundo">
              Texto
            </label>
            <div role="tablist" className="flex rounded-full bg-offwhite p-1 text-sm">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-3 py-1 ${tab === t ? "bg-white font-semibold text-profundo shadow-sm" : "text-marinho/60"}`}
                >
                  {t === "write" ? "Escrever" : "Prévia"}
                </button>
              ))}
            </div>
          </div>

          <div className={tab === "write" ? "" : "hidden"}>
            <div className="flex flex-wrap gap-1 rounded-t-lg border border-b-0 border-profundo/20 bg-offwhite p-1.5">
              {tools.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  title={t.label}
                  aria-label={t.label}
                  onClick={() => apply(t.before, t.after)}
                  className="grid size-9 place-items-center rounded-md text-profundo hover:bg-white"
                >
                  <span className="icon text-xl!">{t.icon}</span>
                </button>
              ))}
            </div>
            <textarea
              ref={area}
              id="body"
              name="body"
              rows={20}
              maxLength={60000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`${inputClass} rounded-t-none font-mono text-sm leading-relaxed`}
            />
          </div>
          {tab === "preview" && (
            <div className="post-body min-h-60 rounded-lg border border-profundo/20 p-6">
              {body.trim() ? <Markdown source={body} /> : <p className="text-marinho/40">Nada escrito ainda.</p>}
            </div>
          )}
          <details className="mt-2 text-xs text-marinho/60">
            <summary className="cursor-pointer">Como formatar o texto</summary>
            <ul className="mt-2 space-y-1 pl-4">
              <li>Deixe uma linha em branco entre parágrafos.</li>
              <li>
                <code>## Título</code> e <code>### Subtítulo</code> no começo da linha.
              </li>
              <li>
                <code>**negrito**</code>, <code>*itálico*</code> e <code>[texto do link](https://endereço)</code>.
              </li>
              <li>
                Linhas começando com <code>- </code> viram lista.
              </li>
              <li>
                <code>[[produtos: link-do-produto, outro-link]]</code> mostra cards do catálogo com o botão de orçamento.
                O link é o final do endereço da página do produto.
              </li>
            </ul>
          </details>
        </div>

        </section>

        <section className={`${panelCard} space-y-5 p-5 md:p-6`}>
          <h2 className="text-sm font-semibold text-profundo">Publicação</h2>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="published" defaultChecked={post?.published ?? false} className="size-5 accent-royal" />
          <span>
            <span className="font-medium">Publicar no site</span>
            <span className="block text-sm text-marinho/60">Desmarcado, o artigo fica salvo como rascunho.</span>
          </span>
        </label>
        </section>

        {state?.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.error}
          </p>
        )}

        {/* Barra de salvar sempre visível ao rolar o formulário */}
        <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-3 border-t border-profundo/10 bg-white/95 px-5 py-3 md:mx-0 md:rounded-xl md:border">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-profundo px-5 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-60"
          >
            {pending ? "Salvando…" : post ? "Salvar alterações" : "Criar artigo"}
          </button>
          <Link href="/admin/blog" className="px-4 py-3 text-marinho/70 hover:text-marinho">
            Cancelar
          </Link>
          {post?.published && (
            <Link href={`/blog/${post.slug}`} target="_blank" className="ml-auto text-sm text-royal underline underline-offset-4">
              Ver no site
            </Link>
          )}
        </div>
      </form>

      <aside className="space-y-6">
        <div className={`${panelCard} p-5`}>
          <p className="mb-3 text-sm font-medium text-profundo">Capa</p>
          <div className="relative mb-4 grid aspect-[16/9] place-items-center overflow-hidden rounded-xl bg-offwhite">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element -- prévia local (blob:) não passa pelo next/image
              <img src={cover} alt="Prévia da capa" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm text-marinho/40">Sem capa</span>
            )}
          </div>
          <label
            htmlFor="cover"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-royal/30 px-4 py-2.5 text-sm font-semibold text-royal hover:bg-royal hover:text-white"
          >
            <span className="icon text-xl!">upload</span>
            {cover ? "Trocar capa" : "Enviar capa"}
          </label>
          <input
            id="cover"
            name="cover"
            type="file"
            form="post-form"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setCover(URL.createObjectURL(f));
            }}
          />
          <p className="mt-2 text-xs text-marinho/50">JPG, PNG ou WebP, até 4 MB. Formato 16:9, por exemplo 1366×768.</p>
        </div>

        {post && (
          <form
            action={deletePost}
            onSubmit={(e) => {
              if (!confirm(`Apagar “${post.title}”? Não dá para desfazer. Para só esconder, desmarque “Publicar no site”.`))
                e.preventDefault();
            }}
            className={`${panelCard} p-5`}
          >
            <input type="hidden" name="id" value={post.id} />
            <button type="submit" className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900">
              <span className="icon text-xl!">delete</span>
              Apagar artigo
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
