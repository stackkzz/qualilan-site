import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadProfile } from "../data";
import { ProfileForm } from "../forms";
import { emptyProfile } from "../profile";
import { AccountShell, panel } from "../shell";

export const metadata: Metadata = {
  title: "Meus dados | Qualilan",
  robots: { index: false, follow: false },
};

async function ProfileEditor() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/conta");
  const profile = await loadProfile(supabase, data.user);
  return (
    <div className={panel}>
      <ProfileForm initial={profile ?? emptyProfile} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AccountShell
      width="max-w-4xl"
      title="Meus dados"
      intro={
        <>
          <Link href="/conta" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
            <span className="icon text-lg!">arrow_back</span>
            Minha conta
          </Link>
          <span className="block">Usados no pedido por e-mail e pelo vendedor para emitir a nota.</span>
        </>
      }
    >
      <Suspense fallback={<PageLoader />}>
        <ProfileEditor />
      </Suspense>
    </AccountShell>
  );
}
