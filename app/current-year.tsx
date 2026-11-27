// Ano calculado no build e cacheado; cada deploy atualiza.
export async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
