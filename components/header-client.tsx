"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOutCustomer } from "@/app/(site)/conta/actions";

type Session = { name: string; email: string } | null;

// Sessão lida do cookie do Supabase (sem ida ao servidor): o cookie guarda a sessão em JSON, às vezes em pedaços.
function readSession(): Session {
  const parts = document.cookie
    .split("; ")
    .map((c) => c.split("="))
    .filter(([k]) => /^sb-.+-auth-token(\.\d+)?$/.test(k))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
  if (!parts.length) return null;
  try {
    let raw = decodeURIComponent(parts.map(([, ...v]) => v.join("=")).join(""));
    if (raw.startsWith("base64-")) raw = new TextDecoder().decode(Uint8Array.from(atob(raw.slice(7).replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));
    const user = JSON.parse(raw)?.user;
    if (!user) return null;
    const meta = user.user_metadata ?? {};
    return { name: String(meta.name ?? meta.profile?.name ?? ""), email: String(user.email ?? "") };
  } catch {
    return { name: "", email: "" };
  }
}

// Atualiza na hora em que a sessão muda (entrar, criar conta, sair), sem recarregar a página.
function useSession() {
  const pathname = usePathname();
  const [session, setSession] = useState<Session>(null);
  const last = useRef("");
  useEffect(() => {
    const check = () => {
      if (document.cookie === last.current) return;
      last.current = document.cookie;
      setSession(readSession());
    };
    check();
    // cookieStore avisa quando o cookie muda; onde não existe, confere a cada 1,5 s (só compara um texto).
    const store = (window as unknown as { cookieStore?: EventTarget }).cookieStore;
    store?.addEventListener("change", check);
    const timer = store ? undefined : window.setInterval(check, 1500);
    window.addEventListener("focus", check);
    return () => {
      store?.removeEventListener("change", check);
      window.clearInterval(timer);
      window.removeEventListener("focus", check);
    };
  }, [pathname]);
  return session;
}

const initials = (s: NonNullable<Session>) =>
  (s.name || s.email)
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

const menu = [
  { href: "/conta", label: "Meus orçamentos", icon: "receipt_long" },
  { href: "/conta/dados", label: "Meus dados", icon: "badge" },
  { href: "/conta/nova-senha", label: "Trocar senha", icon: "key" },
];

// Conta no cabeçalho (computador): "Entrar" para visitante; iniciais e primeiro nome com menu curto para quem entrou.
export function AccountMenu() {
  const session = useSession();
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const close = (e: Event) => {
      const d = ref.current;
      if (!d?.open) return;
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !d.contains(e.target as Node)) d.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  if (!session) {
    return (
      <Link href="/conta" className="hidden h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-profundo transition-colors hover:bg-offwhite md:flex">
        <span aria-hidden className="icon text-[1.4rem]!">
          person
        </span>
        Entrar
      </Link>
    );
  }
  const first = session.name.split(" ")[0];
  return (
    <details ref={ref} className="relative hidden md:block">
      <summary className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-md pl-1.5 pr-2 text-sm font-semibold text-profundo transition-colors hover:bg-offwhite [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-profundo text-xs font-bold text-white">
          {initials(session) || "?"}
        </span>
        <span className="hidden max-w-28 truncate lg:inline">{first || "Minha conta"}</span>
        <span aria-hidden className="icon text-lg! text-marinho/50">
          expand_more
        </span>
        <span className="sr-only">Menu da conta</span>
      </summary>
      <div className="absolute right-0 top-13 w-60 rounded-lg border border-profundo/10 bg-white p-2 shadow-[0_24px_48px_-16px_rgba(18,23,68,0.35)]">
        <p className="truncate px-3 pb-2 pt-1 text-xs text-marinho/55">{session.email}</p>
        <ul>
          {menu.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-profundo hover:bg-offwhite">
                <span aria-hidden className="icon text-lg! text-marinho/50">
                  {m.icon}
                </span>
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
        <form action={signOutCustomer} className="mt-1 border-t border-profundo/10 pt-1">
          <button type="submit" className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-marinho/70 hover:bg-offwhite hover:text-profundo">
            <span aria-hidden className="icon text-lg!">
              logout
            </span>
            Sair
          </button>
        </form>
      </div>
    </details>
  );
}

// Conta dentro do menu do celular.
export function MobileAccountLinks() {
  const session = useSession();
  if (!session) {
    return (
      <Link href="/conta" className="flex items-center gap-2 rounded-md px-3 py-2.5 font-medium text-profundo hover:bg-offwhite">
        <span aria-hidden className="icon text-xl! text-marinho/50">
          person
        </span>
        Entrar
      </Link>
    );
  }
  return (
    <>
      <p className="truncate px-3 pb-1 pt-2 text-xs text-marinho/55">{session.email}</p>
      {menu.map((m) => (
        <Link key={m.href} href={m.href} className="flex items-center gap-2 rounded-md px-3 py-2.5 font-medium text-profundo hover:bg-offwhite">
          <span aria-hidden className="icon text-xl! text-marinho/50">
            {m.icon}
          </span>
          {m.label}
        </Link>
      ))}
      <form action={signOutCustomer}>
        <button type="submit" className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 font-medium text-marinho/70 hover:bg-offwhite">
          <span aria-hidden className="icon text-xl!">
            logout
          </span>
          Sair
        </button>
      </form>
    </>
  );
}

// Link do menu principal com a página atual marcada.
export function NavLink({ href, label, mobile }: { href: string; label: string; mobile?: boolean }) {
  const pathname = usePathname();
  const active = !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
  if (mobile) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`block rounded-md px-3 py-2.5 font-medium hover:bg-offwhite ${active ? "bg-offwhite text-royal" : "text-profundo"}`}
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:rounded-full after:bg-laranja after:transition-transform after:duration-300 hover:text-profundo hover:after:scale-x-100 ${
        active ? "text-profundo after:scale-x-100" : "after:scale-x-0"
      }`}
    >
      {label}
    </Link>
  );
}

// Lupa do celular: na Home, some enquanto a busca grande do topo está na tela (evita duas buscas juntas).
export function MobileSearchButton({ className }: { className: string }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const hero = pathname === "/" ? document.getElementById("hero-search") : null;
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);
  return (
    <Link href="/catalogo#busca" aria-label="Buscar no catálogo" className={`${className} ${hidden && pathname === "/" ? "hidden" : "grid"} xl:hidden`}>
      <span aria-hidden className="icon">
        search
      </span>
    </Link>
  );
}
