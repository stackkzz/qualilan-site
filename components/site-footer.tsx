import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { categories, site, telHref, units, whatsappLink } from "@/lib/site";
import { CurrentYear } from "./current-year";

// Ícones das redes desenhados com formas simples (sem biblioteca nem logo oficial em arquivo).
const socialIcons: Record<string, ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </>
  ),
  LinkedIn: (
    <>
      <rect x="4" y="9" width="3.2" height="11" fill="currentColor" />
      <circle cx="5.6" cy="5.6" r="1.9" fill="currentColor" />
      <path d="M10 9h3v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20H17v-5.8c0-1.4 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z" fill="currentColor" />
    </>
  ),
  Facebook: (
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z" fill="currentColor" />
  ),
  YouTube: (
    <>
      <rect x="2" y="5.5" width="20" height="13" rx="4" fill="currentColor" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="#00001a" />
    </>
  ),
};

function Column({ title, children, wide }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2 lg:col-span-1" : undefined}>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

const linkClass = "text-white/60 transition-colors hover:text-white";

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-marinho text-white">
      {/* Marca d'água com o Q da marca. */}
      <Image
        src="/brand/q-branco.png"
        alt=""
        width={1204}
        height={1244}
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 -z-10 w-[34rem] opacity-[0.04]"
      />

      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="col-span-2 lg:col-span-1">
            <Image src="/brand/logo-branco.png" alt="Qualilan" width={150} height={52} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Distribuidora de infraestrutura de rede, segurança eletrônica e conectividade.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <a href={whatsappLink("Olá, Qualilan! Gostaria de um orçamento.")} className="flex items-center gap-2 text-white/85 hover:text-laranja">
                  <span className="icon text-lg! text-laranja">chat</span>
                  WhatsApp {site.whatsappLabel}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-white/85 hover:text-laranja">
                  <span className="icon text-lg! text-laranja">mail</span>
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <span className="icon text-lg! text-laranja">schedule</span>
                {site.hours}
              </li>
            </ul>
            <ul className="mt-6 flex gap-2" aria-label="Redes sociais">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={s.label}
                    className="grid size-10 place-items-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-laranja hover:bg-laranja hover:text-profundo"
                  >
                    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
                      {socialIcons[s.label]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Column title="Navegação">
            {[
              { label: "Catálogo", href: "/catalogo" },
              { label: "Quem somos", href: "/sobre" },
              { label: "Unidades", href: "/#unidades" },
              { label: "Cases de sucesso", href: "/#cases" },
              { label: "Marcas parceiras", href: "/#marcas" },
              { label: "Privacidade", href: "/privacidade" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Categorias">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/catalogo/${c.slug}`} className={linkClass}>
                  {c.name}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Unidades" wide>
            <li className="text-xs text-white/45">Central SAC {site.sac}</li>
            {units.map((u) => (
              <li key={u.city} className="flex items-baseline justify-between gap-4">
                <span className="text-white/60">
                  {u.city}
                  {u.note && <span className="ml-1.5 text-xs text-amarelo">{u.note}</span>}
                </span>
                <a href={telHref(u.phone)} className="whitespace-nowrap font-medium text-white/85 hover:text-laranja">
                  {u.phone}
                </a>
              </li>
            ))}
          </Column>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>
            © <CurrentYear /> Qualilan. CNPJ {site.cnpj}.
          </p>
          <Link href="/privacidade" className="hover:text-white">
            Política de privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
