import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignUpForm } from "../forms";
import { AccountShell, AuthScreen, Perks, safeNext } from "../shell";

export const metadata: Metadata = {
  title: "Criar conta | Qualilan",
  robots: { index: false, follow: false },
};

async function Form({ searchParams }: { searchParams: PageProps<"/conta/criar">["searchParams"] }) {
  const next = safeNext((await searchParams).next);
  return <SignUpForm next={next} />;
}

export default function SignUpPage({ searchParams }: PageProps<"/conta/criar">) {
  return (
    <AccountShell
      width="max-w-5xl"
      back={{ href: "/conta", label: "Entrar" }}
      title="Criar conta"
      intro={
        <>
          Leva um minuto. Já tem conta?{" "}
          <Link href="/conta" className="font-semibold text-white underline underline-offset-4 hover:text-amarelo">
            Entre aqui
          </Link>
          .
        </>
      }
    >
      <AuthScreen
        wide
        card={
          <Suspense>
            <Form searchParams={searchParams} />
          </Suspense>
        }
        side={<Perks title="O que muda com a conta" intro="A lista e o WhatsApp continuam iguais. A conta acrescenta:" />}
      />
    </AccountShell>
  );
}
