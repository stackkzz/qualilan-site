// Dados institucionais num lugar só. WhatsApp: roteamento por unidade ainda será definido com o cliente.
export const site = {
  name: "Qualilan",
  tagline: "Soluções em teleinformática",
  cnpj: "11.746.517/0001-40",
  whatsapp: "5514996192639",
  whatsappLabel: "(14) 99619-2639",
  email: "e-commerce@qualilan.com.br",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/grupo.qualilan/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/grupo-qualilan/" },
    { label: "Facebook", href: "https://www.facebook.com/qualilanbauru/" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCD5njZm2XODvwRJBoJi2B1g" },
  ],
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

// Fonte: rodapé de loja.qualilan.com.br (nov/2026).
export const units = [
  { city: "Campinas", note: "Matriz", address: "R. Anita Moretzsohn, 336, Jardim Santana, Campinas, SP, 13088-603", phone: "(19) 3256-1042" },
  { city: "São Paulo", address: "R. Benedito Campos Morais, 230, Vila Anastácio, São Paulo, SP, 05094-010", phone: "(11) 3714-0818" },
  { city: "Bauru", address: "R. Jorge Pimentel, 5-54, Vila Engler, Bauru, SP, 17047-010", phone: "(14) 3021-0437" },
  { city: "Vale do Paraíba", address: "Rod. Geraldo Scavone, 2080, Galpão U20, Jardim Califórnia, Jacareí, SP, 12305-490", phone: "(12) 3958-7735" },
  { city: "Minas Gerais", address: "R. Capitão Vicente Ribeiro do Vale, 354, Santa Rita do Sapucaí, MG, 37540-000", phone: "(35) 3471-4172" },
];

export const telHref = (phone: string) => `tel:+55${phone.replace(/\D/g, "")}`;
export const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Qualilan ${address}`)}`;
