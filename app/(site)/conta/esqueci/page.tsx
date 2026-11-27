import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "../forms";

export const metadata: Metadata = {
  title: "Esqueceu a sua senha? | Qualilan",
  robots: { index: false, follow: false },
};

export default function ForgotPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-14 md:py-20">
      <Link href="/conta" className="inline-flex items-center gap-1 text-sm font-semibold text-marinho/60 hover:text-profundo">
        <span className="icon text-lg!">arrow_back</span>
        Minha conta
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-profundo">Esqueceu a sua senha?</h1>
      <p className="mt-2 text-marinho/65">Informe o e-mail da conta e enviaremos um link para criar uma nova senha.</p>
      <div className="mt-8 rounded-2xl border border-profundo/10 bg-white p-6 md:p-8">
        <ForgotForm />
      </div>
    </div>
  );
}
