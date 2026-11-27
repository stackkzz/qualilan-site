import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

const ERRORS: Record<string, string> = {
  "sem-permissao": "Este usuário não tem acesso ao painel. Peça a liberação ao responsável pelo site.",
};

async function Notice({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const erro = (await searchParams).erro;
  const message = typeof erro === "string" ? ERRORS[erro] : undefined;
  return message ? <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{message}</p> : null;
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="grid min-h-screen place-items-center bg-profundo px-5">
      <div className="w-full max-w-sm">
        <Image src="/brand/logo-branco.png" alt="Qualilan" width={180} height={62} className="mx-auto mb-8" preload />
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="text-xl font-bold text-profundo">Entrar no painel</h1>
          <p className="mt-1 mb-6 text-sm text-marinho/60">Acesso da equipe Qualilan para editar o catálogo.</p>
          <Suspense>
            <Notice searchParams={searchParams} />
          </Suspense>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
