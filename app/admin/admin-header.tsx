import Image from "next/image";
import Link from "next/link";
import { signOut } from "./actions";

export function AdminHeader({ email }: { email?: string }) {
  return (
    <header className="bg-profundo text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/brand/logo-branco.png" alt="Qualilan" width={120} height={41} />
          <span className="hidden border-l border-white/20 pl-3 text-sm text-white/70 md:inline">Painel</span>
        </Link>
        <nav className="no-scrollbar flex min-w-0 gap-1 overflow-x-auto text-sm" aria-label="Seções do painel">
          <Link href="/admin" className="rounded-full px-3 py-1.5 text-white/75 hover:bg-white/10 hover:text-white">
            Produtos
          </Link>
          <Link href="/admin/blog" className="rounded-full px-3 py-1.5 text-white/75 hover:bg-white/10 hover:text-white">
            Blog
          </Link>
          <Link href="/admin/pedidos" className="rounded-full px-3 py-1.5 text-white/75 hover:bg-white/10 hover:text-white">
            Pedidos
          </Link>
          <Link href="/admin/metricas" className="rounded-full px-3 py-1.5 text-white/75 hover:bg-white/10 hover:text-white">
            Métricas
          </Link>
          <Link href="/admin/revisao" className="rounded-full px-3 py-1.5 text-white/75 hover:bg-white/10 hover:text-white">
            Revisar nomes
          </Link>
        </nav>
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
