// Separado de catalog.ts para poder ser usado no navegador (sem levar o acesso ao banco junto).
export const SORTS = [
  { value: "disponiveis", label: "Disponíveis primeiro" },
  { value: "az", label: "Nome (A–Z)" },
  { value: "za", label: "Nome (Z–A)" },
  { value: "codigo", label: "Código" },
] as const;
export type Sort = (typeof SORTS)[number]["value"];

export function parseSort(v?: string): Sort {
  return SORTS.some((s) => s.value === v) ? (v as Sort) : "disponiveis";
}
