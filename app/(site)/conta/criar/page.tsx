import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "../forms";
import { AccountShell, panel } from "../shell";

export const metadata: Metadata = {
  title: "Criar conta | Qualilan",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <AccountShell
      width="max-w-4xl"
      title="Criar conta"
      intro={
        <>
          Com CPF ou CNPJ. Já tem conta?{" "}
          <Link href="/conta" className="font-semibold text-white underline underline-offset-4 hover:text-amarelo">
            Entre aqui
          </Link>
          .
        </>
      }
    >
      <div className={panel}>
        <SignUpForm />
      </div>
    </AccountShell>
  );
}
