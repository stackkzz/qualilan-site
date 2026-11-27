// Dados institucionais num lugar só. WhatsApp: roteamento por unidade ainda será definido com o cliente.
export const site = {
  name: "Qualilan",
  tagline: "Soluções em teleinformática",
  cnpj: "11.746.517/0001-40",
  whatsapp: "5514996192639",
  whatsappLabel: "(14) 99619-2639",
  hours: "Segunda a sexta, das 8h às 18h",
  sac: "(14) 3021-0437",
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
  { name: "Switches", icon: "hub", slug: "switches" },
  { name: "Wireless", icon: "wifi", slug: "wireless" },
  { name: "CFTV", icon: "videocam", slug: "cftv" },
  { name: "Controle de acesso", icon: "fingerprint", slug: "controle-de-acesso" },
  { name: "Cabos elétricos", icon: "electrical_services", slug: "cabos-eletricos" },
  { name: "Cabos telefônicos", icon: "deskphone", slug: "cabos-telefonicos" },
  { name: "Canaletas", icon: "view_stream", slug: "canaletas" },
  { name: "Conversores", icon: "sync_alt", slug: "conversores" },
  { name: "Iluminação", icon: "lightbulb", slug: "iluminacao" },
  { name: "Rotuladores", icon: "print", slug: "rotulador-eletronico" },
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
  { city: "Bauru", note: "Central SAC", address: "R. Jorge Pimentel, 5-54, Vila Engler, Bauru, SP, 17047-010", phone: "(14) 3021-0437" },
  { city: "Jacareí", address: "Rod. Geraldo Scavone, 2080, Galpão U20, Jardim Califórnia, Jacareí, SP, 12305-490", phone: "(12) 3958-7735" },
  { city: "Santa Rita do Sapucaí", address: "R. Capitão Vicente Ribeiro do Vale, 354, Santa Rita do Sapucaí, MG, 37540-000", phone: "(35) 3471-4172" },
];

// Endereço em duas linhas: rua e número / o resto (bairro, cidade, CEP).
// Rua e número; bairro, cidade e UF; CEP (exibido sem quebrar no meio).
export function addressLines(address: string) {
  const parts = address.split(", ");
  const cep = /^\d{5}-\d{3}$/.test(parts.at(-1) ?? "") ? parts.pop()! : "";
  return [parts.slice(0, 2).join(", "), parts.slice(2).join(", "), cep] as const;
}

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
  // Marcas do catálogo com logo baixada dos sites oficiais e da Wikimedia (nov/2026).
  { name: "Mikrotik", logo: "/ref/logos/mikrotik.png", w: 534, h: 92 },
  { name: "Seagate", logo: "/ref/logos/seagate.png", w: 378, h: 92 },
  { name: "Lumavi", logo: "/ref/logos/lumavi.png", w: 289, h: 92 },
  { name: "Starlumen", logo: "/ref/logos/starlumen.png", w: 577, h: 92 },
  { name: "SIL", logo: "/ref/logos/sil.png", w: 224, h: 92 },
  { name: "Corfio", logo: "/ref/logos/corfio.png", w: 219, h: 92 },
  { name: "Megatron", logo: "/ref/logos/megatron.png", w: 613, h: 92 },
  { name: "Telecam", logo: "/ref/logos/telecam.png", w: 345, h: 92 },
];

// Logo de uma marca do catálogo (os nomes vêm em caixa alta da loja antiga: "CONTROL ID", "TP-LINK").
export function brandLogo(brand: string | null) {
  if (!brand) return undefined;
  const key = brand.toLowerCase().replace(/[^a-z0-9]/g, "");
  return partners.find((p) => p.name.toLowerCase().replace(/[^a-z0-9]/g, "") === key);
}

export const differentials = [
  { icon: "workspace_premium", title: "25 anos de experiência", text: "Experiência em projetos de empresas de todos os portes." },
  { icon: "warehouse", title: "Distribuidor de soluções tecnológicas", text: "Parceiro comercial de marcas nacionais e internacionais." },
  { icon: "support_agent", title: "Atendimento consultivo", text: "Projetos personalizados para a necessidade real de cada cliente." },
  { icon: "savings", title: "Custo-benefício e pronta entrega", text: "Preço competitivo e estoque para atender rápido." },
  { icon: "domain", title: "Atuação em diversos setores", text: "Universidades, hospitais, indústria, centros logísticos e data centers." },
];

// Destaques da Laserway: artigo "Laserway para redes à prova de futuro" (blog da loja, 2022).
export const customProjects = [
  {
    partner: "Laserway",
    logo: "/ref/logos/laserway.png",
    title: "Solução óptica inovadora",
    text: "Redes 100% ópticas para ambientes corporativos, à prova de futuro, com menos plástico e menor consumo de energia.",
    visual: "fiber",
    features: ["Rede óptica passiva (GPON)", "Até 20 km sem equipamentos ativos", "Até 70% menos cabos"],
    href: "/blog/laserway-para-redes-a-prova-de-futuro",
    hrefLabel: "Entenda a Laserway",
  },
  {
    partner: "ITMAX",
    logo: "/ref/logos/itmax.png",
    title: "Soluções para data center",
    text: "Projetos de infraestrutura para ambientes que não podem parar, desenvolvidos junto com a ITMAX.",
    visual: "rack",
    features: ["Salas técnicas e CPDs", "Racks, energia e cabeamento no mesmo projeto", "Especificação feita com o fabricante"],
    href: whatsappLink("Olá, Qualilan! Gostaria de falar sobre um projeto de data center com a ITMAX."),
    hrefLabel: "Falar sobre um projeto",
  },
] as const;

// Avaliações públicas: Google Maps (unidades Bauru e Campinas, nov/2026) e depoimentos da loja antiga.
// Trechos longos foram encurtados sem mudar o sentido.
export const googleRating = { score: "5,0", count: 262, unit: "Bauru" };

export type Testimonial = { name: string; text: string; source: "Google" | "Site"; unit?: string; photo?: string };

export const testimonials: Testimonial[] = [
  { name: "Andreia Bergamini", source: "Google", unit: "Bauru", text: "Fiquei impressionada com o atendimento e a simpatia dos funcionários! Tudo muito bem explicado nos detalhes." },
  { name: "Marcelo Girsas", source: "Google", unit: "Campinas", text: "Tem uma grande variedade de materiais de rede a pronta entrega e sempre com excelente atendimento." },
  { name: "Klebison Carmo", source: "Site", photo: "/ref/depoimentos/klebison.jpg", text: "Ótimo atendimento e parceria nos projetos executados. Hoje em dia é essencial a parceria do dia a dia, isso a Qualilan faz muito bem." },
  { name: "Ian Verderesi", source: "Google", unit: "Bauru", text: "Precisei de uma antena específica em um prazo muito rápido e fui muito bem atendido. Obrigado e parabéns pelo atendimento." },
  { name: "Odir Macedo", source: "Google", unit: "Campinas", text: "Excelente suporte técnico, produtos de ponta e o melhor custo-benefício. Recomendo!" },
  { name: "Natan Oliveira", source: "Site", photo: "/ref/depoimentos/natan.jpg", text: "Empresa qualificada e com ótimo atendimento, parabéns a todos os envolvidos. Qualilan, eu recomendo!" },
  { name: "Kleuber Henrique", source: "Google", unit: "Bauru", text: "Uma empresa confiável, que oferece materiais de alta qualidade, além de um pós-venda impecável." },
  { name: "Wagner Santana", source: "Google", unit: "Campinas", text: "Atendimento muito bom, a equipe é muito atenciosa e prestativa. Produtos de qualidade, das melhores marcas." },
  { name: "Cristiano Franco", source: "Site", photo: "/ref/depoimentos/cristiano.jpg", text: "Pessoas comprometidas com a minha necessidade e com opções variadas de componentes para a aplicação." },
  { name: "Hannes Fischer", source: "Google", unit: "Bauru", text: "Atendimento fantástico, super atencioso. Logo entraram em contato pelo WhatsApp, com uma pessoa real do outro lado ajudando." },
  { name: "Paulo Roberto Filomeno", source: "Google", unit: "Campinas", text: "Atendem muito bem o cliente, entregam rapidamente e têm preços competitivos." },
  { name: "Douglas Pereira", source: "Google", unit: "Bauru", text: "Já conhecia o trabalho da empresa e tinha confiança no fornecimento de qualidade. Estamos muito satisfeitos com a parceria." },
  { name: "Gabriel Barreto", source: "Google", unit: "Campinas", text: "Pessoal da loja 100% atencioso, tiraram todas as dúvidas e foram muito solícitos." },
  { name: "Fernando Camargo", source: "Site", photo: "/ref/depoimentos/fernando.jpg", text: "Excelente atendimento, variedade e qualidade de produtos por um preço justo." },
];

// Cases em vídeo publicados no site institucional (qualilan.com.br, nov/2026).
export const cases: { id: string; client: string; tag?: string; lowResOnly?: boolean }[] = [
  { id: "zFgLWH_TgAQ", lowResOnly: true, client: "Colégio Chaminade", tag: "Soluções Lightera" },
  { id: "jPcqPEUNJro", client: "Santuário de Aparecida" },
  { id: "Frz_uTJEcGU", client: "TV Aparecida" },
  { id: "KDXv-jH1FlI", client: "Cidade do Romeiro" },
  { id: "_NRCoBsBUB0", client: "Unimed Araraquara", tag: "Programa Green IT" },
];
