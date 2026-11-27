"use client";

import type { ReactNode } from "react";

// Luz que segue o mouse nos cards (ideia da LP da Zaion). Um único ouvinte no grupo:
// grava a posição do cursor em --x/--y do card [data-spot] sob o mouse; o brilho é CSS (.spot no globals.css).
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      onPointerMove={(e) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spot]");
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--x", `${e.clientX - r.left}px`);
        card.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
