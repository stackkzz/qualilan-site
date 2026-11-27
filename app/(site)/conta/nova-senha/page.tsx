import type { Metadata } from "next";
import { NewPasswordForm } from "../forms";

export const metadata: Metadata = {
  title: "Nova senha | Qualilan",
  robots: { index: false, follow: false },
};

// Chega aqui pelo link do e-mail (/auth/callback já abriu a sessão); a action confere se ainda está logado.
export default function NewPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-14 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-profundo">Criar nova senha</h1>
      <p className="mt-2 text-marinho/65">Escolha uma senha com pelo menos 8 caracteres.</p>
      <div className="mt-8 rounded-2xl border border-profundo/10 bg-white p-6 md:p-8">
        <NewPasswordForm />
      </div>
    </div>
  );
}
