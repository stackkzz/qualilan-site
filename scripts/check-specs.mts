// npx tsx scripts/check-specs.mts
import assert from "node:assert/strict";
import { parseSpecs, splitSpec } from "../lib/specs";

const lines = parseSpecs("Analíticos: exceção, área de intrusão\n(classificação de humanos, veículos e motos/bicicletas), contagem de alvos (classificação\nde humanos, veículos)\nProteção IP67\n- Garantia de 12 meses;\n\n");
assert.deepEqual(lines, [
  "Analíticos: exceção, área de intrusão (classificação de humanos, veículos e motos/bicicletas), contagem de alvos (classificação de humanos, veículos)",
  "Proteção IP67",
  "Garantia de 12 meses",
]);
assert.deepEqual(splitSpec("Capacidade: 126W"), ["Capacidade", "126W"]);
assert.equal(splitSpec("Proteção IP67"), null);
console.log("ficha ok");
