import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "../forms";
import { AccountShell, panel } from "../shell";

export const metadata: Metadata = {
  title: "Esqueceu a sua senha? | Qualilan",
  robots: { index: false, follow: false },
};

export default function ForgotPage() {
  return (
    <AccountShell width="max-w-md" title="Esqueceu a sua senha?" intro="Mandamos um link para você criar uma nova.">
      <div className={panel}>
        <ForgotForm />
      </div>
      <Link href="/conta" className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-marinho/60 hover:text-profundo">
        <span className="icon text-lg!">arrow_back</span>
        Voltar para o login
      </Link>
    </AccountShell>
  );
}
