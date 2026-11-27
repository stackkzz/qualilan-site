"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Último item do cabeçalho. O cookie de sessão do Supabase diz se a pessoa está logada,
// sem tornar o cabeçalho (que é estático) dinâmico.
export function AccountLink() {
  const [logged, setLogged] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cookie só existe no cliente
    setLogged(/sb-[^=]+-auth-token/.test(document.cookie));
  }, []);
  const label = logged ? "Minha conta" : "Entrar";
  return (
    <Link
      href="/conta"
      aria-label={label}
      className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-1 text-sm font-semibold text-profundo transition-colors hover:bg-offwhite lg:pr-3.5"
    >
      <span
        className={`grid size-9 place-items-center rounded-full transition-colors ${
          logged ? "bg-profundo text-white" : "bg-royal/10 text-royal group-hover:bg-royal group-hover:text-white"
        }`}
      >
        <span className={`icon text-[1.35rem]! ${logged ? "icon-fill" : ""}`}>person</span>
      </span>
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
}
