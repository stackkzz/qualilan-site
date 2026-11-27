import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Manual pede Helvetica Neue (licença web paga); Inter é a substituta livre mais próxima.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const icons = [
  "account_balance", "agriculture", "arrow_back", "badge", "bolt", "cable", "add", "delete", "edit", "logout", "upload", "visibility_off", "call", "chat", "check",
  "close", "dns", "done_all", "electric_bolt", "factory", "inventory_2", "label", "lan", "lightbulb", "mail", "menu",
  "local_hospital", "local_shipping", "location_on", "map", "playlist_add", "request_quote", "school",
  "search", "settings_ethernet", "swap_horiz", "videocam", "view_stream", "wifi",
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
          href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&icon_names=${icons}&display=block`}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">{children}</body>
    </html>
  );
}
