import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "../admin-nav";

async function UserEmail() {
  const { user } = await requireAdmin();
  return <>{user.email}</>;
}

// Moldura das telas do painel (o login fica fora deste grupo, sem menu).
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:flex">
      <AdminNav
        email={
          <Suspense fallback="…">
            <UserEmail />
          </Suspense>
        }
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
