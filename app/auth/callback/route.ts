import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Volta do link de acesso enviado por e-mail: troca o código pela sessão e segue para a conta.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/conta";
  // Só caminhos internos: evita usar o link para mandar o visitante a outro site.
  const target = next.startsWith("/") && !next.startsWith("//") ? next : "/conta";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(target, url.origin));
  }
  return NextResponse.redirect(new URL("/conta?erro=link", url.origin));
}
