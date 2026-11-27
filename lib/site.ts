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

// Material de qualilan.com.br e loja.qualilan.com.br (nov/2026), copiado para public/ref.
export const partners = [
  { name: "Lightera", logo: "/ref/logos/lightera2.png", w: 200, h: 46 },
  { name: "Furukawa", logo: "/ref/logos/furukawa.png", w: 200, h: 54 },
  { name: "Ubiquiti", logo: "/ref/logos/ubiquiti.png", w: 151, h: 46 },
  { name: "TP-Link", logo: "/ref/logos/tp-link.png", w: 105, h: 40 },
  { name: "Motorola", logo: "/ref/logos/motorola.png", w: 147, h: 52 },
  { name: "Control iD", logo: "/ref/logos/controlid.png", w: 132, h: 23 },
  { name: "Brother", logo: "/ref/logos/brother.png", w: 121, h: 46 },
  { name: "Multiway", logo: "/ref/logos/multiway.png", w: 199, h: 28 },
  { name: "Dutotec", logo: "/ref/logos/dutotec.png", w: 146, h: 28 },
  { name: "Tramontina", logo: "/ref/logos/tramontina.png", w: 161, h: 33 },
];

export const differentials = [
  { icon: "/ref/icons/exp.png", title: "Mais de 25 anos de experiência", text: "Uma história construída com confiança, parceria e inovação." },
  { icon: "/ref/icons/distribuidor.png", title: "Distribuidor de soluções tecnológicas", text: "Parceiro comercial de marcas nacionais e internacionais." },
  { icon: "/ref/icons/atendimento.png", title: "Atendimento consultivo", text: "Projetos personalizados para a necessidade real de cada cliente." },
  { icon: "/ref/icons/custo.png", title: "Custo-benefício e pronta entrega", text: "Estoque em cinco unidades e preço competitivo." },
  { icon: "/ref/icons/verticais.png", title: "Atuação em diversos setores", text: "Universidades, hospitais, indústria, centros logísticos e data centers." },
];

export const customProjects = [
  {
    partner: "Laserway",
    logo: "/ref/logos/laserway.png",
    title: "Solução óptica inovadora",
    text: "Projetos de fibra óptica dimensionados para o seu ambiente, do backbone à última milha.",
    image: "/ref/city-cta.jpg",
  },
  {
    partner: "ITMAX",
    logo: "/ref/logos/itmax.png",
    title: "Soluções para data center",
    text: "Infraestrutura completa para salas técnicas e data centers, com marcas homologadas.",
    image: "/ref/bg-tech.jpeg",
  },
];

export const testimonials = [
  { name: "Klebison Carmo", photo: "/ref/depoimentos/klebison.jpg", text: "Ótimo atendimento e parceria nos projetos executados. Hoje em dia é essencial a parceria do dia a dia, isso a Qualilan faz muito bem. Parabéns!" },
  { name: "Natan Oliveira", photo: "/ref/depoimentos/natan.jpg", text: "Empresa qualificada e com ótimo atendimento, parabéns a todos os envolvidos. Qualilan, eu recomendo!" },
  { name: "Cristiano Franco", photo: "/ref/depoimentos/cristiano.jpg", text: "Muito boa a experiência: pessoas comprometidas com a minha necessidade e com opções variadas de componentes para a aplicação." },
  { name: "Fernando Camargo", photo: "/ref/depoimentos/fernando.jpg", text: "Excelente atendimento, variedade e qualidade de produtos por um preço justo." },
];
