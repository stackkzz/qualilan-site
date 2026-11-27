import Image from "next/image";
import Link from "next/link";
import { site, telHref, units, whatsappLink } from "@/lib/site";
import { CurrentYear } from "./current-year";

export function SiteFooter() {
  return (
    <footer className="bg-marinho text-sm text-white/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src="/brand/logo-branco.png" alt="Qualilan" width={140} height={48} />
          <p className="mt-4 max-w-xs leading-relaxed">
            Distribuidora de infraestrutura de rede, segurança eletrônica e conectividade.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-semibold text-white">Contato</h2>
          <ul className="space-y-1.5">
            <li>
              <a href={whatsappLink("Olá, Qualilan! Gostaria de um orçamento.")} className="hover:text-white">
                WhatsApp {site.whatsappLabel}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            {units.map((u) => (
              <li key={u.city}>
                <a href={telHref(u.phone)} className="hover:text-white">
                  {u.city} {u.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-semibold text-white">Qualilan</h2>
          <ul className="space-y-1.5">
            <li>
              <Link href="/sobre" className="hover:text-white">
                Quem somos
              </Link>
            </li>
            <li>
              <Link href="/catalogo" className="hover:text-white">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="hover:text-white">
                Privacidade
              </Link>
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener" className="hover:text-white">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-5 py-5 text-center text-xs">
        Qualilan, CNPJ {site.cnpj}. © <CurrentYear />
      </p>
    </footer>
  );
}
