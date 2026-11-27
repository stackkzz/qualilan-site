// Ícone do WhatsApp desenhado à mão (balão com telefone), sem arquivo de logo nem biblioteca.
export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.7 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2.1.4 0 .5l-.4.6c-.1.2-.2.3 0 .6.4.7.9 1.2 1.5 1.7.6.4 1 .6 1.3.7.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.3 0 .5-.1 1.1-.5 1.5-.4.4-1.1.8-1.9.7-.8 0-2.3-.5-3.8-1.9-1.5-1.4-2.4-3-2.6-3.8-.2-.9.1-1.6.4-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Visual padrão dos botões que abrem o WhatsApp: pílula com contorno verde, sem preenchimento.
const pill =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border-2 px-6 py-3 font-semibold transition-colors";
export const whatsappButtonClass = `${pill} border-[#25D366] text-[#0F7A6E] hover:bg-[#25D366]/10 [&_svg]:text-[#25D366]`;
// Para fundos escuros (azul da marca).
export const whatsappButtonDarkClass = `${pill} border-[#25D366] text-white hover:bg-[#25D366]/15 [&_svg]:text-[#25D366]`;

// Envelope em traço, no mesmo estilo de linha do ícone do WhatsApp.
export function MailIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 7.1 5.3a1.5 1.5 0 0 0 1.8 0L20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
