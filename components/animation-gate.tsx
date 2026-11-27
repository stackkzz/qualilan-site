"use client";

import { useEffect } from "react";

// Pausa as animações em loop (fibras, mapa, LEDs, faixas) das seções fora da tela.
// Sem isso o celular continua redesenhando seções que ninguém está vendo.
// Marca cada <section> visível com data-visible; o CSS pausa o resto (regra em globals.css).
// Animações SMIL do mapa (pacotes) não obedecem ao CSS: são pausadas pela API do SVG.
export function AnimationGate() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        document.documentElement.setAttribute("data-gated", ""); // só depois de saber o que está visível
        for (const e of entries) {
          const el = e.target as HTMLElement;
          el.toggleAttribute("data-visible", e.isIntersecting);
          el.querySelectorAll("svg").forEach((svg) => (e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
        }
      },
      { rootMargin: "120px 0px" },
    );
    const watch = () => document.querySelectorAll("main section, main [data-anim]").forEach((s) => io.observe(s));
    watch();
    // Navegação entre páginas troca o conteúdo: observa as seções novas (no máximo uma vez por quadro).
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (!queued) queued = requestAnimationFrame(() => ((queued = 0), watch()));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(queued);
      document.documentElement.removeAttribute("data-gated");
    };
  }, []);
  return null;
}
