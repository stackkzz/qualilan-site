import Image from "next/image";

// Texto do banner da loja antiga: explica por que produtos Furukawa aparecem como Lightera.
export function LighteraNotice() {
  return (
    <aside className="flex items-center gap-5 rounded-xl border border-profundo/10 bg-white p-4 md:p-5">
      <Image src="/ref/logos/lightera2.png" alt="Lightera" width={200} height={46} className="h-8 w-auto shrink-0" />
      <p className="text-sm leading-relaxed text-marinho/75">
        <span className="font-semibold text-profundo">A qualidade Furukawa agora é Lightera.</span> Mesma excelência em
        conectividade, com um novo nome. A Qualilan é distribuidora autorizada.
      </p>
    </aside>
  );
}
