// Dados institucionais num lugar só. WhatsApp: roteamento por unidade ainda será definido com o cliente.
export const site = {
  name: "Qualilan",
  tagline: "Soluções em teleinformática",
  cnpj: "11.746.517/0001-40",
  whatsapp: "5514996192639",
  whatsappLabel: "(14) 99619-2639",
  instagram: "https://www.instagram.com/grupo.qualilan/",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const categories = [
  { name: "Cabos de rede", icon: "settings_ethernet", slug: "cabos-lan" },
  { name: "Rede óptica", icon: "cable", slug: "rede-optica" },
  { name: "Switches", icon: "lan", slug: "switches" },
  { name: "Wireless", icon: "wifi", slug: "wireless" },
  { name: "CFTV", icon: "videocam", slug: "cftv" },
  { name: "Controle de acesso", icon: "badge", slug: "controle-de-acesso" },
  { name: "Cabos elétricos", icon: "bolt", slug: "cabos-eletricos" },
  { name: "Cabos telefônicos", icon: "call", slug: "cabos-telefonicos" },
  { name: "Canaletas", icon: "view_stream", slug: "canaletas" },
  { name: "Conversores", icon: "swap_horiz", slug: "conversores" },
  { name: "Iluminação", icon: "lightbulb", slug: "iluminacao" },
  { name: "Rotuladores", icon: "label", slug: "rotulador-eletronico" },
];

export const segments = [
  { name: "Hospitais", icon: "local_hospital" },
  { name: "Indústrias", icon: "factory" },
  { name: "Agronegócio", icon: "agriculture" },
  { name: "Data centers", icon: "dns" },
  { name: "Centros logísticos", icon: "local_shipping" },
  { name: "Educação", icon: "school" },
  { name: "Usinas", icon: "electric_bolt" },
  { name: "Órgãos públicos", icon: "account_balance" },
];

export const brands = [
  "Furukawa",
  "Ubiquiti",
  "TP-Link",
  "Motorola",
  "Control iD",
  "Brother",
  "Multiway",
  "Lightera",
  "Mikrotik",
  "Planet",
];

export const units = ["Campinas", "São Paulo", "Bauru", "Vale do Paraíba", "Minas Gerais"];
