import Image from "next/image";
import { MailIcon, WhatsAppIcon } from "@/components/whatsapp-icon";
import Link from "next/link";
import type { ReactNode } from "react";
import { categories, site, telHref, units, whatsappLink } from "@/lib/site";
import { CurrentYear } from "./current-year";
import { socialIcons } from "./social-icons";

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
                <a href={whatsappLink("Olá, Qualilan! Gostaria de um orçamento.")} className="flex items-center gap-2 text-white/85 hover:text-[#25D366]">
                  <WhatsAppIcon className="size-[18px] text-[#25D366]" />
                  WhatsApp {site.whatsappLabel}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-white/85 hover:text-laranja">
                  <MailIcon className="size-[18px] text-laranja" />
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
