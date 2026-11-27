import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "../forms";

export const metadata: Metadata = {
  title: "Criar conta | Qualilan",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <Link href="/conta" className="inline-flex items-center gap-1 text-sm font-semibold text-marinho/60 hover:text-profundo">
        <span className="icon text-lg!">arrow_back</span>
        Minha conta
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-profundo md:text-4xl">Criar conta</h1>
      <p className="mt-2 text-marinho/65">
        Já tem conta?{" "}
        <Link href="/conta" className="font-semibold text-royal hover:underline">
          Entre aqui
        </Link>
        .
      </p>
      <div className="mt-8 rounded-2xl border border-profundo/10 bg-white p-6 md:p-8">
        <SignUpForm />
      </div>
    </div>
  );
}
