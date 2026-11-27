import Image from "next/image";
import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { QuoteCartButton } from "./quote-cart";

const nav = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Marcas", href: "/#marcas" },
  { label: "Unidades", href: "/#unidades" },
  { label: "Quem somos", href: "/sobre" },
];

export function SiteHeader() {
  return (
    <>
      <header className="header-scroll sticky top-0 z-40 border-b border-profundo/10 bg-white/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 md:h-[4.5rem]">
          <Link href="/" aria-label="Qualilan, página inicial" className="shrink-0">
            <Image src="/brand/logo-azul.png" alt="Qualilan" width={140} height={48} preload className="w-28 sm:w-[8.5rem]" />
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex gap-7 whitespace-nowrap text-[15px] font-medium text-marinho/70">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-laranja after:transition-transform after:duration-300 hover:text-profundo hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form action="/catalogo" role="search" className="ml-auto hidden lg:block">
            <label htmlFor="header-q" className="sr-only">
              Buscar no catálogo
            </label>
            <div className="flex items-center rounded-lg border border-profundo/10 bg-offwhite px-3 transition-colors focus-within:border-royal focus-within:bg-white">
              <span className="icon text-lg! text-marinho/40">search</span>
              <input
                id="header-q"
                name="q"
                type="search"
                placeholder="Buscar produto ou código"
                className="w-52 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-marinho/40 focus:w-64 motion-safe:transition-[width]"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <QuoteCartButton />
            {/* Menu do celular sem JavaScript: <details> abre e fecha nativamente. */}
            <details className="group relative md:hidden">
              <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-lg border border-profundo/10 text-profundo [&::-webkit-details-marker]:hidden">
                <span className="icon group-open:hidden">menu</span>
                <span className="icon hidden group-open:inline">close</span>
                <span className="sr-only">Menu</span>
              </summary>
              <nav
                aria-label="Menu"
                className="absolute right-0 top-14 w-64 rounded-2xl border border-profundo/10 bg-white p-2 shadow-[0_24px_48px_-16px_rgba(18,23,68,0.35)]"
              >
                <form action="/catalogo" role="search" className="mb-2">
                  <label htmlFor="mobile-q" className="sr-only">
                    Buscar no catálogo
                  </label>
                  <input
                    id="mobile-q"
                    name="q"
                    type="search"
                    placeholder="Buscar produto ou código"
                    className="w-full rounded-lg border border-profundo/10 bg-offwhite px-3 py-2.5 text-sm outline-none focus:border-royal"
                  />
                </form>
                <ul>
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="block rounded-lg px-3 py-2.5 font-medium text-profundo hover:bg-offwhite">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-2 border-t border-profundo/10 pt-2">
                    <a
                      href={whatsappLink("Olá, Qualilan! Gostaria de um orçamento.")}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-royal hover:bg-offwhite"
                    >
                      <span className="icon text-lg!">chat</span>
                      WhatsApp {site.whatsappLabel}
                    </a>
                  </li>
                </ul>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
