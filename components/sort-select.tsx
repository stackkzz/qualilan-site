"use client";

import { useRouter } from "next/navigation";
import { SORTS, type Sort } from "@/lib/sorts";

// Troca a ordenação na URL e volta para a página 1.
export function SortSelect({ value, hrefFor }: { value: Sort; hrefFor: Record<Sort, string> }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm text-marinho/60">
      <span className="icon text-lg!">swap_vert</span>
      <span className="sr-only sm:not-sr-only">Ordenar por</span>
      <select
        value={value}
        onChange={(e) => router.push(hrefFor[e.target.value as Sort], { scroll: false })}
        className="rounded-lg border border-profundo/15 bg-white py-2 pl-3 pr-8 font-medium text-profundo outline-none focus:border-royal"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}
