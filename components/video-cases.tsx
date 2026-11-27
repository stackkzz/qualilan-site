"use client";

import Image from "next/image";
import { useState } from "react";
import { cases } from "@/lib/site";

// Miniatura 16:9 (320×180), sem as faixas pretas da versão 4:3.
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
// Capa grande em 1280×720; alguns vídeos antigos não têm essa versão no YouTube.
const cover = (c: (typeof cases)[number]) =>
  c.lowResOnly ? `https://i.ytimg.com/vi/${c.id}/hqdefault.jpg` : `https://i.ytimg.com/vi/${c.id}/maxresdefault.jpg`;

// Player principal + lista ao lado. Clicar na lista (ou nas setas) troca o vídeo em destaque.
// O player do YouTube só carrega quando a pessoa clica em play.
export function VideoCases() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = cases[active];

  const go = (i: number) => {
    setActive(i);
    setPlaying(false);
  };
  // Função de atualização: cliques rápidos nas setas somam certo.
  const step = (delta: number) => {
    setActive((a) => (a + delta + cases.length) % cases.length);
    setPlaying(false);
  };

  const arrow =
    "grid size-11 place-items-center rounded-full border border-profundo/15 text-profundo transition-colors hover:border-profundo hover:bg-profundo hover:text-white";

  return (
    <section id="cases" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="reveal-title max-w-2xl">
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem] md:leading-[1.1]">
              Cases de sucesso
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-marinho/65">
              Projetos entregues pela Qualilan, contados por quem viveu cada um.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-marinho/55" aria-live="polite">
              {active + 1} de {cases.length}
            </span>
            <button type="button" onClick={() => step(-1)} className={arrow} aria-label="Case anterior">
              <span className="icon">chevron_left</span>
            </button>
            <button type="button" onClick={() => step(1)} className={arrow} aria-label="Próximo case">
              <span className="icon">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          {/* Destaque */}
          <figure>
            <div className="group relative aspect-video overflow-hidden rounded-2xl bg-marinho">
              {playing ? (
                <iframe
                  key={current.id}
                  src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0`}
                  title={`Case de sucesso: ${current.client}`}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 size-full"
                >
                  <Image
                    key={current.id}
                    src={cover(current)}
                    alt={`Capa do case ${current.client}`}
                    fill
                    sizes="(min-width: 1024px) 700px, 100vw"
                    // Capa sem versão grande: inteira e no tamanho dela, sem esticar.
                    className={`case-swap transition-transform duration-700 group-hover:scale-105 ${current.lowResOnly ? "object-contain" : "object-cover"}`}
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-marinho/85 via-marinho/10 to-transparent" />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-laranja text-profundo shadow-[0_12px_40px_-8px_rgba(255,153,0,0.7)] transition-transform duration-300 group-hover:scale-110"
                  >
                    <svg viewBox="0 0 24 24" className="ml-1 size-8" fill="currentColor">
                      <path d="M7 4.5v15l12.5-7.5z" />
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 p-6 text-left text-white">
                    <span className="sr-only">Assistir ao case de sucesso: </span>
                    <span className="block text-xl font-bold md:text-2xl">{current.client}</span>
                    {current.tag && <span className="text-sm text-white/75">{current.tag}</span>}
                  </span>
                </button>
              )}
            </div>
          </figure>

          {/* Lista dos cases */}
          <ul className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {cases.map((c, i) => {
              const isActive = i === active;
              return (
                <li key={c.id} className="w-56 shrink-0 lg:w-auto">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={isActive ? "true" : undefined}
                    className={`group flex w-full flex-col gap-2 rounded-xl p-2 text-left transition-colors lg:flex-row lg:items-center lg:gap-4 ${
                      isActive ? "bg-profundo text-white" : "hover:bg-offwhite"
                    }`}
                  >
                    <span className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-marinho lg:w-32">
                      <Image src={thumb(c.id)} alt={`Capa do case ${c.client}`} fill sizes="(min-width: 1024px) 128px, 224px" className="object-cover" />
                      {isActive && (
                        <span className="absolute inset-0 grid place-items-center bg-profundo/50">
                          <span className="icon icon-fill text-2xl! text-laranja">{playing ? "graphic_eq" : "play_circle"}</span>
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 px-1 lg:px-0">
                      <span className={`block truncate text-sm font-semibold ${isActive ? "text-white" : "text-profundo"}`}>
                        {c.client}
                      </span>
                      {c.tag && (
                        <span className={`block truncate text-xs ${isActive ? "text-white/65" : "text-marinho/55"}`}>{c.tag}</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
