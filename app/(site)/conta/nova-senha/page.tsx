import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewPasswordForm } from "../forms";
import { RESET_COOKIE } from "../reset";
import { AccountShell, AuthScreen } from "../shell";

export const metadata: Metadata = {
  title: "Trocar senha | Qualilan",
  robots: { index: false, follow: false },
};

// Pelo link do "esqueci a senha" o link já é a prova; pelo painel, pede a senha atual.
async function Form() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/conta?next=/conta/nova-senha");
  const fromLink = (await cookies()).get(RESET_COOKIE)?.value === data.user.id;
  return <NewPasswordForm needsCurrent={!fromLink} />;
}

export default function NewPasswordPage() {
  return (
    <AccountShell width="max-w-5xl" back={{ href: "/conta", label: "Minha conta" }} title="Trocar senha" intro="Use pelo menos 8 caracteres.">
      <AuthScreen
        card={
          <Suspense fallback={<PageLoader className="min-h-48!" label="Carregando…" />}>
            <Form />
          </Suspense>
        }
        side={
          <>
            <h2 className="text-xl font-bold text-profundo">Dica</h2>
            <p className="mt-3 text-marinho/70">
              Uma frase curta com números é mais fácil de lembrar e difícil de adivinhar. Não use a mesma senha de outros sites.
            </p>
          </>
        }
      />
    </AccountShell>
  );
}
