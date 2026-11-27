// Bloco de ícone padrão do site: quadrado com fundo da marca; o ícone se preenche no hover do pai (.group).
export function IconTile({ icon, size = "md" }: { icon: string; size?: "sm" | "md" | "lg" }) {
  const box = { sm: "size-10 rounded-lg", md: "size-12 rounded-xl", lg: "size-14 rounded-2xl" }[size];
  const glyph = { sm: "text-xl!", md: "text-2xl!", lg: "text-[1.75rem]!" }[size];
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center bg-royal/8 text-royal transition-colors duration-300 group-hover:bg-profundo group-hover:text-amarelo ${box}`}
    >
      <span className={`icon icon-hover-fill ${glyph}`}>{icon}</span>
    </span>
  );
}
