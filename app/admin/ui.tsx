import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-profundo/20 bg-white px-3 py-2.5 text-marinho outline-none focus:border-royal focus:ring-2 focus:ring-royal/20";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-profundo">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-marinho/50">{hint}</p>}
    </div>
  );
}
