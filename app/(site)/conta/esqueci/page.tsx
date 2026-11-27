import type { Metadata } from "next";
import { site } from "@/lib/site";
import { ForgotForm } from "../forms";
import { AccountShell, AuthScreen } from "../shell";

export const metadata: Metadata = {
  title: "Esqueci a senha | Qualilan",
  robots: { index: false, follow: false },
};

export default function ForgotPage() {
  return (
    <AccountShell width="max-w-5xl" back={{ href: "/conta", label: "Entrar" }} title="Esqueci a senha" intro="Mandamos um link para você criar uma nova.">
      <AuthScreen
        card={<ForgotForm />}
        side={
          <>
            <h2 className="text-xl font-bold text-profundo">Não chegou?</h2>
            <ul className="mt-4 space-y-3 text-marinho/70">
              <li>Confira a caixa de spam e a pasta Promoções.</li>
              <li>Abra o link neste mesmo navegador; em outro aparelho ele não funciona.</li>
              <li>
                Se não lembrar o e-mail da conta, fale com a Central SAC: {site.sac}, {site.hours.toLowerCase()}.
              </li>
            </ul>
          </>
        }
      />
    </AccountShell>
  );
}
