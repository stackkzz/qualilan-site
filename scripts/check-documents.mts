// Checagem rápida de CPF/CNPJ: npx tsx scripts/check-documents.mts
import assert from "node:assert/strict";
import { isValidCNPJ, isValidCPF } from "../lib/documents";

assert.ok(isValidCPF("529.982.247-25"));
assert.ok(isValidCPF("52998224725"));
assert.ok(!isValidCPF("529.982.247-24"));
assert.ok(!isValidCPF("111.111.111-11"));
assert.ok(!isValidCPF("123"));
assert.ok(isValidCNPJ("11.746.517/0001-40")); // CNPJ da própria Qualilan (rodapé da loja)
assert.ok(isValidCNPJ("11222333000181"));
assert.ok(!isValidCNPJ("11.222.333/0001-80"));
assert.ok(!isValidCNPJ("00.000.000/0000-00"));
console.log("documentos ok");
