import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Manual pede Helvetica Neue (licença web paga); Inter é a substituta livre mais próxima.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const icons = [
  "account_balance", "add", "person", "mark_email_read", "badge", "replay", "history", "edit_note", "post_add", "add_box", "open_in_new", "monitoring", "article", "spellcheck", "space_dashboard", "add_shopping_cart", "agriculture", "arrow_back", "arrow_forward", "bolt", "cable", "call", "chat", "check", "check_circle", "chevron_left", "chevron_right", "close",
  "delete", "deskphone", "dns", "domain", "done_all", "edit", "eco", "electric_bolt", "electrical_services", "event", "factory",
  "fingerprint", "format_bold", "format_list_bulleted", "graphic_eq", "grid_view", "groups", "hub", "inventory_2", "lightbulb", "link", "local_hospital", "local_shipping", "location_on", "logout",
  "mail", "map", "menu", "play_circle", "playlist_add", "print", "remove", "request_quote", "savings", "schedule", "school", "search",
  "settings_ethernet", "shopping_cart", "star", "support_agent", "swap_vert", "sync_alt", "title", "upload", "verified", "videocam", "view_stream",
  "visibility_off", "warehouse", "wifi", "workspace_premium",
].sort().join(","); // a API exige nomes em ordem alfabética

export const metadata: Metadata = {
  title: "Qualilan | Distribuidora de redes, CFTV e conectividade",
  description:
    "Catálogo de cabeamento, fibra óptica, switches, wireless, CFTV e controle de acesso das principais marcas. Pronta entrega e orçamento pelo WhatsApp.",
  // Demonstração de proposta: fora do Google até a Qualilan aprovar e o site ir para o domínio oficial.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <head>
        {/* Abre a conexão com o Google Fonts antes: os ícones aparecem mais cedo */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0&icon_names=${icons}&display=block`}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">{children}</body>
    </html>
  );
}
