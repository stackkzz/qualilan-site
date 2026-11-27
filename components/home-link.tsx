"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

// Logo do cabeçalho: nas outras páginas leva à Home; na própria Home volta ao topo.
export function HomeLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      {...props}
      href="/"
      onClick={(e) => {
        if (location.pathname !== "/") return;
        e.preventDefault();
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    />
  );
}
