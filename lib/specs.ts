// Ficha técnica da loja antiga: texto colado com quebras no meio da frase e marcadores "- ".
// Vira uma lista de itens, juntando a linha que continua a anterior (começa com minúscula ou "(",
// ou a anterior tem parêntese aberto).
export function parseSpecs(text: string) {
  const out: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/^\s*[-•*]\s*/, "").trim();
    if (!line) continue;
    const prev = out[out.length - 1];
    const open = prev ? (prev.match(/\(/g) ?? []).length > (prev.match(/\)/g) ?? []).length : false;
    if (prev && (open || /^[a-zà-ú(]/.test(line))) out[out.length - 1] = `${prev} ${line}`;
    else out.push(line.replace(/;$/, ""));
  }
  return out;
}

// "Chave: valor" curto vira par (rótulo e valor); o resto fica como texto.
export function splitSpec(line: string): [string, string] | null {
  const m = line.match(/^([^:]{2,32}):\s+(.+)$/);
  return m ? [m[1].trim(), m[2].trim()] : null;
}
