"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { signOut } from "./actions";

const sections = [
  { href: "/admin", label: "Início", icon: "space_dashboard" },
  { href: "/admin/produtos", label: "Produtos", icon: "inventory_2" },
  { href: "/admin/revisao", label: "Revisar nomes", icon: "spellcheck" },
  { href: "/admin/blog", label: "Blog", icon: "article" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "mail" },
  { href: "/admin/metricas", label: "Métricas", icon: "monitoring" },
];

// Lista pura; a versão com destaque lê a URL e fica dentro de <Suspense> (exigência das rotas dinâmicas).
function NavList({ path }: { path: string }) {
  return (
    <ul className="space-y-0.5">
      {sections.map((s) => {
        const active = s.href === "/admin" ? path === "/admin" : path.startsWith(s.href);
        return (
          <li key={s.href}>
            <Link
              href={s.href}
              // No celular o menu fica num <details>: fecha ao escolher a seção.
              onClick={(e) => e.currentTarget.closest("details")?.removeAttribute("open")}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-profundo text-white" : "text-marinho/70 hover:bg-offwhite hover:text-profundo"
              }`}
            >
              <span className={`icon text-xl! ${active ? "icon-fill text-amarelo" : ""}`}>{s.icon}</span>
              {s.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Account({ email }: { email: ReactNode }) {
  return (
    <div className="space-y-1 border-t border-profundo/10 pt-4">
      <p className="truncate px-3 text-xs text-marinho/50">{email}</p>
      <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-marinho/70 hover:bg-offwhite">
        <span className="icon text-xl!">open_in_new</span>
        Ver o site
      </Link>
      <form action={signOut}>
        <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-marinho/70 hover:bg-offwhite">
          <span className="icon text-xl!">logout</span>
          Sair
        </button>
      </form>
    </div>
  );
}

function ActiveLinks() {
  return <NavList path={usePathname()} />;
}

function Links() {
  return (
    <Suspense fallback={<NavList path="" />}>
      <ActiveLinks />
    </Suspense>
  );
}

// Menu do painel: lateral fixa no computador; no celular, barra no topo com o menu abrindo por cima.
export function AdminNav({ email }: { email: ReactNode }) {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-profundo/10 bg-white p-4 lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2 px-3 pt-2">
          <Image src="/brand/logo-azul.png" alt="Qualilan" width={110} height={38} />
          <span className="text-xs font-semibold text-marinho/40">Painel</span>
        </Link>
        <nav aria-label="Seções do painel" className="flex-1">
          <Links />
        </nav>
        <Account email={email} />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-profundo/10 bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/brand/logo-azul.png" alt="Qualilan" width={96} height={33} />
          <span className="text-xs font-semibold text-marinho/40">Painel</span>
        </Link>
        <details className="group relative">
          <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-profundo/10 [&::-webkit-details-marker]:hidden">
            <span className="icon group-open:hidden">menu</span>
            <span className="icon hidden group-open:inline">close</span>
            <span className="sr-only">Menu do painel</span>
          </summary>
          <div className="absolute right-0 top-12 w-64 rounded-xl border border-profundo/10 bg-white p-3 shadow-xl">
            <nav aria-label="Seções do painel">
              <Links />
            </nav>
            <div className="mt-3">
              <Account email={email} />
            </div>
          </div>
        </details>
      </header>
    </>
  );
}
