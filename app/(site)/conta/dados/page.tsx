import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { site } from "@/lib/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutCustomer } from "../actions";
import { loadProfile } from "../data";
import { ChangeEmailForm, DeleteAccountForm, ProfileForm } from "../forms";
import { emptyProfile } from "../profile";
import { AccountShell, panel } from "../shell";

export const metadata: Metadata = {
  title: "Meus dados | Qualilan",
  robots: { index: false, follow: false },
};

async function ProfileEditor() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/conta?next=/conta/dados");
  const profile = await loadProfile(supabase, data.user);
  return (
    <div className="space-y-6">
      <div className={panel}>
        <ProfileForm initial={profile ?? emptyProfile} locked={Boolean(profile?.doc)} sac={site.sac} />
      </div>
      <div className={`${panel} grid gap-5 md:grid-cols-[200px_1fr] md:gap-8`}>
        <div>
          <h2 className="font-semibold text-profundo">Acesso</h2>
          <p className="mt-1 text-sm leading-snug text-marinho/55">E-mail atual: {data.user.email}</p>
        </div>
        <div className="space-y-6">
          <ChangeEmailForm email={data.user.email ?? ""} />
          <Link href="/conta/nova-senha" className="inline-flex items-center gap-2 text-sm font-semibold text-royal hover:underline">
            <span aria-hidden className="icon text-lg!">
              key
            </span>
            Trocar senha
          </Link>
          <div className="border-t border-profundo/10 pt-5">
            <DeleteAccountForm />
          </div>
        </div>
      </div>
      <form action={signOutCustomer}>
        <button type="submit" className="inline-flex items-center gap-1.5 text-sm font-semibold text-marinho/60 hover:text-profundo">
          <span aria-hidden className="icon text-lg!">
            logout
          </span>
          Sair da conta
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AccountShell
      width="max-w-4xl"
      back={{ href: "/conta", label: "Minha conta" }}
      title="Meus dados"
      intro="Usados no pedido por e-mail e pelo vendedor para emitir a nota."
    >
      <Suspense fallback={<PageLoader label="Carregando seus dados…" />}>
        <ProfileEditor />
      </Suspense>
    </AccountShell>
  );
}
