import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // shortcut: fotos ainda servidas pela loja Magento; migrar para storage próprio antes de desligá-la.
    remotePatterns: [new URL("https://loja.qualilan.com.br/pub/media/**")],
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
