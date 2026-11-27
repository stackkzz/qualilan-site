import { NextResponse } from "next/server";
import { RESET_COOKIE } from "@/app/(site)/conta/reset";
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
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const res = NextResponse.redirect(new URL(target, url.origin));
      // Veio do "esqueci a senha": por 15 minutos a nova senha não pede a atual (o link já provou quem é).
      if (target === "/conta/nova-senha") {
        res.cookies.set(RESET_COOKIE, data.user.id, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 900, path: "/" });
      }
      return res;
    }
  }
  return NextResponse.redirect(new URL("/conta?erro=link", url.origin));
}
