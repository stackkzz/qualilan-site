import Image from "next/image";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import Link from "next/link";
import { HomeLink } from "./home-link";
import { site, whatsappLink } from "@/lib/site";
import { Suspense } from "react";
import { AccountMenu, MobileAccountLinks, MobileSearchButton, NavLink } from "./header-client";
import { QuoteCartButton } from "./quote-cart";

const nav = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Unidades", href: "/#unidades" },
  { label: "Cases", href: "/#cases" },
  { label: "Blog", href: "/blog" },
  { label: "Quem somos", href: "/sobre" },
];

export function SiteHeader() {
  return (
    <>
      <header className="header-scroll sticky top-0 z-40 border-b border-profundo/10 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 md:h-[4.5rem]">
          <HomeLink aria-label="Qualilan, página inicial" className="shrink-0">
            <Image src="/brand/logo-azul.png" alt="Qualilan" width={140} height={48} preload className="w-28 sm:w-[8.5rem]" />
          </HomeLink>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex gap-7 whitespace-nowrap text-[15px] font-medium text-marinho/70">
              {nav.map((item) => (
                <li key={item.href}>
                  <Suspense fallback={<Link href={item.href} className="py-2">{item.label}</Link>}>
                    <NavLink href={item.href} label={item.label} />
                  </Suspense>
                </li>
              ))}
            </ul>
          </nav>

          <form action="/catalogo" role="search" className="header-search ml-auto hidden xl:block">
            <label htmlFor="header-q" className="sr-only">
              Buscar no catálogo
            </label>
            <div className="flex items-center rounded-lg border border-profundo/10 bg-offwhite px-3 transition-[border-color,background-color,box-shadow] focus-within:border-royal focus-within:bg-white focus-within:ring-4 focus-within:ring-royal/15">
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

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            {/* Lupa no celular e tablet: leva à busca do catálogo */}
            <Suspense>
              <MobileSearchButton className="size-11 place-items-center rounded-md border border-profundo/10 text-profundo transition-colors hover:border-profundo/30 hover:bg-offwhite" />
            </Suspense>
            <QuoteCartButton />
            <span aria-hidden className="mx-1 hidden h-7 w-px bg-profundo/10 md:block" />
            <Suspense>
              <AccountMenu />
            </Suspense>
            {/* Menu do celular sem JavaScript: <details> abre e fecha nativamente. */}
            <details className="group relative md:hidden">
              <summary className="grid size-11 place-items-center rounded-md border border-profundo/10 text-profundo transition-colors hover:border-profundo/30 hover:bg-offwhite cursor-pointer list-none [&::-webkit-details-marker]:hidden">
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
                    className="w-full rounded-lg border border-profundo/10 bg-offwhite px-3 py-2.5 text-sm outline-none transition-shadow focus:border-royal focus:bg-white focus:ring-4 focus:ring-royal/15"
                  />
                </form>
                <ul>
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Suspense fallback={<Link href={item.href} className="block px-3 py-2.5 font-medium text-profundo">{item.label}</Link>}>
                        <NavLink href={item.href} label={item.label} mobile />
                      </Suspense>
                    </li>
                  ))}
                  <li className="mt-2 border-t border-profundo/10 pt-2">
                    <Suspense>
                      <MobileAccountLinks />
                    </Suspense>
                  </li>
                  <li className="mt-2 border-t border-profundo/10 pt-2">
                    <a
                      href={whatsappLink("Olá, Qualilan! Gostaria de um orçamento.")}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#128C7E] hover:bg-offwhite"
                    >
                      <WhatsAppIcon className="size-[18px]" />
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
