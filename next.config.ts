import type { NextConfig } from "next";

// Cabeçalhos de segurança em todas as páginas.
// shortcut: sem Content-Security-Policy completa (YouTube, Google Fonts, imagens do Supabase e scripts do Next exigem
// uma lista fina); só frame-ancestors, que impede o site de ser embutido em outro. Fazer a CSP completa no lançamento.
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
  images: {
    // shortcut: fotos ainda servidas pela loja Magento; migrar para storage próprio antes de desligá-la.
    remotePatterns: [
      new URL("https://loja.qualilan.com.br/pub/media/**"),
      new URL("https://*.supabase.co/storage/v1/object/public/produtos/**"),
      new URL("https://i.ytimg.com/vi/**"),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
