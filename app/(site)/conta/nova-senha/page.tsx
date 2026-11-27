import type { Metadata } from "next";
import Link from "next/link";
import { NewPasswordForm } from "../forms";
import { AccountShell, panel } from "../shell";

export const metadata: Metadata = {
  title: "Nova senha | Qualilan",
  robots: { index: false, follow: false },
};

// Vem do link do e-mail (/auth/callback já abriu a sessão) ou do "Trocar senha" no painel; a action confere a sessão.
export default function NewPasswordPage() {
  return (
    <AccountShell width="max-w-md" title="Nova senha" intro="Escolha uma senha com pelo menos 8 caracteres.">
      <div className={panel}>
        <NewPasswordForm />
      </div>
      <Link href="/conta" className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-marinho/60 hover:text-profundo">
        <span className="icon text-lg!">arrow_back</span>
        Minha conta
      </Link>
    </AccountShell>
  );
}
