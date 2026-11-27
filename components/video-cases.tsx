"use client";

import Image from "next/image";
import { useState } from "react";
import { cases } from "@/lib/site";

// Só a capa é carregada; o player do YouTube (pesado) entra quando a pessoa clica.
function VideoCase({ id, client, tag, featured }: { id: string; client: string; tag?: string; featured?: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className={`group flex flex-col ${featured ? "md:col-span-2 md:row-span-2" : ""}`}>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-marinho">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={`Case de sucesso: ${client}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 size-full"
            aria-label={`Assistir ao case de sucesso: ${client}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              sizes={featured ? "(min-width: 768px) 760px, 100vw" : "(min-width: 768px) 380px, 100vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-marinho/80 via-marinho/10 to-transparent" />
            <span
              aria-hidden
              className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-laranja text-profundo shadow-[0_12px_40px_-8px_rgba(255,153,0,0.7)] transition-transform duration-300 group-hover:scale-110 ${
                featured ? "size-20" : "size-14"
              }`}
            >
              <svg viewBox="0 0 24 24" className={featured ? "ml-1 size-8" : "ml-0.5 size-6"} fill="currentColor">
                <path d="M7 4.5v15l12.5-7.5z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3">
        <span className={`block font-semibold text-profundo ${featured ? "text-xl" : ""}`}>{client}</span>
        {tag && <span className="text-sm text-marinho/60">{tag}</span>}
      </figcaption>
    </figure>
  );
}

export function VideoCases() {
  return (
    <section id="cases" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="reveal-title max-w-2xl">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-profundo md:text-[2.5rem] md:leading-[1.1]">
            Cases de sucesso
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-marinho/65">
            Projetos entregues pela Qualilan, contados por quem viveu cada um.
          </p>
        </div>
        <div className="reveal mt-12 grid gap-x-6 gap-y-8 md:grid-cols-4">
          {cases.map((c, i) => (
            <VideoCase key={c.id} {...c} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
