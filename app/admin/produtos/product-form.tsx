"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { categories } from "@/lib/site";
import { deleteProduct, saveProduct } from "../actions";
import { Field, inputClass } from "../ui";

export type EditableProduct = {
  id: string;
  name: string;
  sku: string | null;
  brand: string | null;
  category: string;
  description: string;
  image_url: string | null;
  in_stock: boolean;
  published: boolean;
  slug: string;
  mfr_code: string | null;
  unit: string | null;
  subcategory: string | null;
};

export function ProductForm({ product, brands }: { product?: EditableProduct; brands: string[] }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form action={action} className="space-y-5 rounded-2xl bg-white p-6 md:p-8" id="product-form">
        {product && <input type="hidden" name="id" value={product.id} />}

        <Field label="Nome do produto" htmlFor="name">
          <input id="name" name="name" required minLength={2} maxLength={300} defaultValue={product?.name} className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Categoria" htmlFor="category">
            <select id="category" name="category" required defaultValue={product?.category ?? ""} className={inputClass}>
              <option value="" disabled>
                Escolha…
              </option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Marca" htmlFor="brand" hint="Escreva como a marca se apresenta, ex.: TP-Link.">
            <input id="brand" name="brand" list="brand-list" maxLength={60} defaultValue={product?.brand ?? ""} className={inputClass} />
            <datalist id="brand-list">
              {brands.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Código Qualilan" htmlFor="sku" hint="Aparece no site e na mensagem de orçamento.">
            <input id="sku" name="sku" maxLength={60} defaultValue={product?.sku ?? ""} className={inputClass} />
          </Field>
          <Field label="Código do fabricante" htmlFor="mfr_code" hint="Opcional. A busca do site também encontra por ele.">
            <input id="mfr_code" name="mfr_code" maxLength={60} defaultValue={product?.mfr_code ?? ""} className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Tipo (subcategoria)" htmlFor="subcategory" hint="Ex.: Patch cord Cat.6. Vira filtro na categoria.">
            <input id="subcategory" name="subcategory" maxLength={60} defaultValue={product?.subcategory ?? ""} className={inputClass} />
          </Field>
          <Field label="Vendido em" htmlFor="unit" hint="Opcional. Ex.: caixa 305 m, peça.">
            <input id="unit" name="unit" maxLength={60} defaultValue={product?.unit ?? ""} className={inputClass} />
          </Field>
        </div>

        <Field label="Descrição" htmlFor="description" hint="Opcional. Especificações, aplicações, o que vem na caixa.">
          <textarea
            id="description"
            name="description"
            rows={6}
            maxLength={5000}
            defaultValue={product?.description}
            className={inputClass}
          />
        </Field>

        <fieldset className="space-y-3">
          <legend className="sr-only">Situação</legend>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="in_stock" defaultChecked={product?.in_stock ?? true} className="size-5 accent-royal" />
            <span>
              <span className="font-medium">Pronta entrega</span>
              <span className="block text-sm text-marinho/60">Desmarcado, o site mostra “Sob consulta”.</span>
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="published" defaultChecked={product?.published ?? true} className="size-5 accent-royal" />
            <span>
              <span className="font-medium">Mostrar no site</span>
              <span className="block text-sm text-marinho/60">Desmarcado, o produto fica oculto mas não é apagado.</span>
            </span>
          </label>
        </fieldset>

        {state?.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-royal px-6 py-3 font-semibold text-white hover:bg-profundo disabled:opacity-60"
          >
            {pending ? "Salvando…" : product ? "Salvar alterações" : "Criar produto"}
          </button>
          <Link href="/admin" className="px-4 py-3 text-marinho/70 hover:text-marinho">
            Cancelar
          </Link>
          {product && (
            <Link href={`/produto/${product.slug}`} target="_blank" className="ml-auto text-sm text-royal underline underline-offset-4">
              Ver no site
            </Link>
          )}
        </div>
      </form>

      <aside className="space-y-6">
        <div className="rounded-2xl bg-white p-6">
          <p className="mb-3 text-sm font-medium text-profundo">Foto</p>
          <div className="relative mb-4 grid aspect-square place-items-center overflow-hidden rounded-xl bg-offwhite">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- prévia local (blob:) não passa pelo next/image
              <img src={preview} alt="Prévia da foto" className="h-full w-full object-contain p-3 mix-blend-multiply" />
            ) : (
              <span className="text-sm text-marinho/40">Sem foto</span>
            )}
          </div>
          <label
            htmlFor="image"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-royal/30 px-4 py-2.5 text-sm font-semibold text-royal hover:bg-royal hover:text-white"
          >
            <span className="icon text-xl!">upload</span>
            {preview ? "Trocar foto" : "Enviar foto"}
          </label>
          <input
            id="image"
            name="image"
            type="file"
            form="product-form"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
          <p className="mt-2 text-xs text-marinho/50">JPG, PNG ou WebP, até 4 MB. Fundo branco fica melhor.</p>
        </div>

        {product && (
          <form
            action={deleteProduct}
            onSubmit={(e) => {
              if (!confirm(`Apagar “${product.name}” do catálogo? Não dá para desfazer. Para só esconder, desmarque “Mostrar no site”.`))
                e.preventDefault();
            }}
            className="rounded-2xl bg-white p-6"
          >
            <input type="hidden" name="id" value={product.id} />
            <button type="submit" className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900">
              <span className="icon text-xl!">delete</span>
              Apagar produto
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
