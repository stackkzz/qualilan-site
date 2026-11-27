import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Manual pede Helvetica Neue (licença web paga); Inter é a substituta livre mais próxima.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const icons = [
  "account_balance", "add", "add_shopping_cart", "agriculture", "arrow_back", "bolt", "cable", "call", "chat", "check", "chevron_left", "chevron_right", "close",
  "delete", "deskphone", "dns", "domain", "done_all", "edit", "eco", "electric_bolt", "electrical_services", "event", "factory",
  "fingerprint", "graphic_eq", "grid_view", "groups", "hub", "inventory_2", "lightbulb", "local_hospital", "local_shipping", "location_on", "logout",
  "mail", "map", "menu", "play_circle", "playlist_add", "print", "remove", "request_quote", "savings", "schedule", "school", "search",
  "settings_ethernet", "shopping_cart", "star", "support_agent", "swap_vert", "sync_alt", "upload", "verified", "videocam", "view_stream",
  "visibility_off", "warehouse", "wifi", "workspace_premium",
].sort().join(","); // a API exige nomes em ordem alfabética

export const metadata: Metadata = {
  title: "Qualilan | Distribuidora de redes, CFTV e conectividade",
  description:
    "Catálogo de cabeamento, fibra óptica, switches, wireless, CFTV e controle de acesso das principais marcas. Pronta entrega e orçamento pelo WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0&icon_names=${icons}&display=block`}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">{children}</body>
    </html>
  );
}
