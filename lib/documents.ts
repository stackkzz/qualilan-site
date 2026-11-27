// Validação de CPF e CNPJ pelos dígitos verificadores (aceita com ou sem pontuação).
export const onlyDigits = (s: string) => s.replace(/\D/g, "");

function checkDigit(digits: number[], weights: number[]) {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCPF(value: string) {
  const d = onlyDigits(value).split("").map(Number);
  if (d.length !== 11 || new Set(d).size === 1) return false;
  const d1 = checkDigit(d.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = checkDigit(d.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d[9] === d1 && d[10] === d2;
}

export function isValidCNPJ(value: string) {
  const d = onlyDigits(value).split("").map(Number);
  if (d.length !== 14 || new Set(d).size === 1) return false;
  const d1 = checkDigit(d.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = checkDigit(d.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d[12] === d1 && d[13] === d2;
}

// Máscara progressiva: "0" é um dígito. Serve para formatar enquanto a pessoa digita e para exibir.
export function mask(value: string, pattern: string) {
  const d = onlyDigits(value);
  let out = "";
  let i = 0;
  for (const ch of pattern) {
    if (i >= d.length) break;
    out += ch === "0" ? d[i++] : ch;
  }
  return out;
}

export const MASKS = {
  cpf: "000.000.000-00",
  cnpj: "00.000.000/0000-00",
  cep: "00000-000",
};

// Celular/telefone brasileiro, com ou sem +55: (14) 99999-9999 ou (14) 3021-0437.
export function formatPhone(value: string) {
  let d = onlyDigits(value);
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  return mask(d, d.length > 10 ? "(00) 00000-0000" : "(00) 0000-00000");
}
