import Image from "next/image";
import { site, whatsappLink } from "@/lib/site";
import { CurrentYear } from "./current-year";

export function SiteFooter() {
  return (
    <footer className="bg-marinho text-sm text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <Image src="/brand/logo-branco.png" alt="Qualilan" width={130} height={45} />
        <p>
          Qualilan, CNPJ {site.cnpj}. © <CurrentYear />
        </p>
        <div className="flex gap-6">
          <a href={site.instagram} className="hover:text-white">
            Instagram
          </a>
          <a href={whatsappLink("Olá, Qualilan! Gostaria de um orçamento.")} className="hover:text-white">
            WhatsApp {site.whatsappLabel}
          </a>
        </div>
      </div>
    </footer>
  );
}
