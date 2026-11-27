function readEnv(name: string, value: string | undefined) {
  if (!value) throw new Error(`Variável de ambiente ausente: ${name}. Preencha no .env.local (veja .env.example).`);
  return value;
}

export function supabaseEnv() {
  return {
    // Acesso literal: o Next só embute NEXT_PUBLIC_* quando o nome aparece por extenso.
    url: readEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    key: readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  };
}
