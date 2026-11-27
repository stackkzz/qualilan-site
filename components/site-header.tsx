import Image from "next/image";
import Link from "next/link";
import { QuoteCartButton } from "./quote-cart";

const nav = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Marcas", href: "/#marcas" },
  { label: "Unidades", href: "/#unidades" },
  { label: "Quem somos", href: "/sobre" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-profundo/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 md:h-[4.5rem]">
        <Link href="/" aria-label="Qualilan, página inicial" className="shrink-0">
          <Image src="/brand/logo-azul.png" alt="Qualilan" width={140} height={48} preload className="w-28 sm:w-[8.75rem]" />
        </Link>
        <nav aria-label="Principal" className="flex-1">
          <ul className="flex justify-end gap-6 whitespace-nowrap text-[15px] font-medium text-marinho/70 md:justify-center lg:gap-9">
            {nav.map((item, i) => (
              // No celular só o Catálogo aparece; o resto são âncoras e páginas secundárias.
              <li key={item.href} className={i > 0 ? "hidden md:block" : undefined}>
                <Link href={item.href} className="transition-colors hover:text-profundo">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <QuoteCartButton />
      </div>
    </header>
  );
}
