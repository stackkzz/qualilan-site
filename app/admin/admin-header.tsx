import Image from "next/image";
import Link from "next/link";
import { signOut } from "./actions";

export function AdminHeader({ email }: { email?: string }) {
  return (
    <header className="bg-profundo text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/brand/logo-branco.png" alt="Qualilan" width={120} height={41} />
          <span className="border-l border-white/20 pl-3 text-sm text-white/70">Painel do catálogo</span>
        </Link>
        <div className="ml-auto flex items-center gap-5 text-sm">
          <Link href="/" target="_blank" className="hidden text-white/70 hover:text-white sm:inline">
            Ver site
          </Link>
          {email && <span className="hidden text-white/50 md:inline">{email}</span>}
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-1.5 text-white/70 hover:text-white">
              <span className="icon text-xl!">logout</span>
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
