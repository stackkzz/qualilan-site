import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
