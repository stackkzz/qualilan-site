import { Suspense } from "react";
import { PageLoader } from "@/components/qualilan-loader";
import { requireAdmin } from "@/lib/admin";
import { AdminHeader } from "../admin-header";
import { setRequestStatus } from "./actions";

type Item = { name: string; sku: string | null; qty: number };

const statusLabel = { novo: "Novo", respondido: "Respondido", arquivado: "Arquivado" } as const;

async function RequestList() {
  const { supabase, user } = await requireAdmin();
  const { data, error } = await supabase
    .from("quote_requests")
    .select("id, name, company, email, phone, message, items, status, created_at")
    .neq("status", "arquivado")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);

  return (
    <>
      <AdminHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-profundo">Pedidos por e-mail</h1>
        <p className="mt-1 text-marinho/60">
          {data.filter((r) => r.status === "novo").length} novos. Pedidos enviados pelo formulário “Prefere receber por
          e-mail?” da lista de orçamento.
        </p>

        <ul className="mt-6 space-y-4">
          {data.map((r) => {
            const items = r.items as Item[];
            const reply = `mailto:${r.email}?subject=${encodeURIComponent("Orçamento Qualilan")}`;
            return (
              <li key={r.id} className="rounded-2xl bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-profundo">
                      {r.name}
                      {r.company && <span className="font-normal text-marinho/60">, {r.company}</span>}
                    </p>
                    <p className="mt-1 text-sm text-marinho/60">
                      <a href={reply} className="text-royal underline underline-offset-4">
                        {r.email}
                      </a>
                      {r.phone && <> · {r.phone}</>} · {new Date(r.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === "novo" ? "bg-amarelo/40 text-profundo" : "bg-offwhite text-marinho/60"}`}
                  >
                    {statusLabel[r.status as keyof typeof statusLabel]}
                  </span>
                </div>
                <ul className="mt-4 divide-y divide-profundo/10 rounded-lg border border-profundo/10 text-sm">
                  {items.map((i, n) => (
                    <li key={n} className="flex justify-between gap-4 px-3 py-2">
                      <span>
                        {i.name}
                        {i.sku && <span className="text-marinho/50"> (cód. {i.sku})</span>}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums">{i.qty} un.</span>
                    </li>
                  ))}
                </ul>
                {r.message && <p className="mt-3 text-sm text-marinho/75">“{r.message}”</p>}
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <a href={reply} className="rounded-full bg-royal px-4 py-2 font-semibold text-white hover:bg-profundo">
                    Responder por e-mail
                  </a>
                  {r.phone && (
                    <a
                      href={`https://wa.me/55${r.phone.replace(/\D/g, "").replace(/^55/, "")}`}
                      target="_blank"
                      rel="noopener"
                      className="rounded-full border border-profundo/20 px-4 py-2 font-semibold text-profundo hover:border-profundo"
                    >
                      Chamar no WhatsApp
                    </a>
                  )}
                  {(["respondido", "arquivado"] as const)
                    .filter((s) => s !== r.status)
                    .map((s) => (
                      <form key={s} action={setRequestStatus}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value={s} />
                        <button type="submit" className="rounded-full px-4 py-2 text-marinho/60 hover:text-marinho">
                          Marcar como {statusLabel[s].toLowerCase()}
                        </button>
                      </form>
                    ))}
                </div>
              </li>
            );
          })}
          {data.length === 0 && <li className="rounded-2xl bg-white px-6 py-10 text-center text-marinho/60">Nenhum pedido ainda.</li>}
        </ul>
      </main>
    </>
  );
}

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={
        <>
          <div className="h-14 bg-profundo" />
          <PageLoader />
        </>
      }>
      <RequestList />
    </Suspense>
  );
}
