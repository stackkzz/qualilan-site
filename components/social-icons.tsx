import type { ReactNode } from "react";

// Ícones das redes desenhados com formas simples (sem biblioteca nem logo oficial em arquivo).
export const socialIcons: Record<string, ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </>
  ),
  LinkedIn: (
    <>
      <rect x="4" y="9" width="3.2" height="11" fill="currentColor" />
      <circle cx="5.6" cy="5.6" r="1.9" fill="currentColor" />
      <path d="M10 9h3v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20H17v-5.8c0-1.4 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z" fill="currentColor" />
    </>
  ),
  Facebook: (
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z" fill="currentColor" />
  ),
  // Triângulo vazado (evenodd): continua visível com qualquer cor de fundo, inclusive no hover.
  YouTube: (
    <path
      fillRule="evenodd"
      d="M6 5.5h12a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4ZM10 9.2v5.6l4.8-2.8Z"
      fill="currentColor"
    />
  ),
};
