// Confere o "Compre junto" com nomes reais do catálogo: npx tsx scripts/check-complements.mts
import assert from "node:assert/strict";
import { complementsFor } from "../lib/catalog";

const names = [
  "Câmera IP bullet facial Motorola 5MP IR 50m 2.8mm Analytics MTIBM055702",
  "Câmera bullet Motorola Full HD 1080p IR 20m 3.6mm MTABP022602",
  "Gravador DVR Motorola 8 canais Full HD MTR08AFHD",
  "Switch de mesa Mercusys MS105 5 portas 10/100",
  "Switch TP-Link TL-SG1008MP 8 portas Gigabit PoE+ mesa/rack",
  "Cabo de dados Furukawa Multilan U/UTP 24AWGx4P Cat.6 CM RoHS azul",
  "Cabo coaxial Telecam 4mm 85% slim branco caixa 100 m",
  "Conector BNC mola RG59 com parafuso ALM CY-YK-3184-10",
  "Fonte eletrônica chaveada ALM 12V/5A 60W colmeia AL-1705G",
  "Gateway Ubiquiti UniFi Dream Machine Pro UDM-PRO-BR 8 portas 10G NVR",
  "Access point Ubiquiti UniFi U6-LITE Wi-Fi 6 2x2 2.4/5GHz 1.5Gbps",
  "Arandela Lumavi Barcelona 1xG9 PR 2465",
];
const all = names.map((name, i) => ({ slug: `p${i}`, name, brand: null, inStock: true }) as never);
const sug = (i: number) => complementsFor(all[i], all).map((p: { name: string }) => p.name);

const ipCam = sug(0);
assert.ok(ipCam.every((n) => !/DVR|Full HD 1080p|10\/100$/.test(n)), `câmera IP: ${ipCam}`);
assert.ok(ipCam.some((n) => /PoE/.test(n)) && ipCam.some((n) => /NVR/.test(n)) && ipCam.some((n) => /Cat\.6/.test(n)));
const analog = sug(1);
assert.ok(analog.some((n) => /DVR/.test(n)) && analog.some((n) => /coaxial/.test(n)) && !analog.some((n) => /IP|PoE/.test(n)), `analógica: ${analog}`);
assert.ok(sug(2).some((n) => /Full HD 1080p/.test(n)), "DVR pede câmera analógica");
assert.equal(sug(11).length, 0, "sem regra, sem seção");
console.log("compre junto ok");
