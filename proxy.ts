import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/supabase/env";

function withCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((c) => to.cookies.set(c));
  return to;
}

// Renova a sessão do /admin e da área do cliente. No /admin, quem não está logado vai para o login.
export async function proxy(request: NextRequest) {
  const { url, key } = supabaseEnv();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (!request.nextUrl.pathname.startsWith("/admin")) return response; // /conta: só renova a sessão
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!data.user && !isLogin) {
    return withCookies(response, NextResponse.redirect(new URL("/admin/login", request.url)));
  }
  // Só administrador logado pula o login; cliente logado fica na tela (que avisa que não tem acesso), sem vai-e-volta.
  if (data.user && isLogin) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin) return withCookies(response, NextResponse.redirect(new URL("/admin", request.url)));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/conta"],
};
