import Image from "next/image";
import Link from "next/link";
import { QuoteCartButton } from "./quote-cart";

const nav = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Segmentos", href: "/#segmentos" },
  { label: "Marcas", href: "/#marcas" },
  { label: "Unidades", href: "/#unidades" },
];

export function SiteHeader() {
  return (
    <header className="bg-profundo text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" aria-label="Qualilan, página inicial">
          <Image src="/brand/logo-branco.png" alt="Qualilan" width={160} height={55} preload className="w-32 sm:w-40" />
        </Link>
        <nav aria-label="Principal" className="flex-1">
          <ul className="flex justify-end gap-8 text-[15px] text-white/80 md:justify-center">
            {nav.map((item, i) => (
              // No celular só o Catálogo aparece; o resto são âncoras da Home.
              <li key={item.href} className={i > 0 ? "hidden md:block" : undefined}>
                <Link href={item.href} className="transition-colors hover:text-white">
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
