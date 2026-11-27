// Importa o catálogo público da loja Magento antiga para data/products.json.
// Uso: node scripts/import-loja.mjs
// shortcut: imagens continuam apontando para loja.qualilan.com.br; baixar para o novo storage antes de desligar o Magento.
import { writeFile, mkdir } from "node:fs/promises";

const BASE = "https://loja.qualilan.com.br";
// slug novo -> caminho antigo da categoria
const CATEGORIES = {
  "cabos-lan": "cabos-lan",
  "rede-optica": "rede-optica",
  switches: "switches",
  wireless: "wireless",
  cftv: "cftv",
  "controle-de-acesso": "controle-de-acesso",
  "cabos-eletricos": "cabos-eletricos",
  "cabos-telefonicos": "cabos-telefonicos",
  canaletas: "canaletas",
  conversores: "conversores",
  iluminacao: "iluminac-o",
  "rotulador-eletronico": "rotulador-eletronico",
};

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();

const stripTags = (s) => decode(s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/[ \t]+/g, " ").replace(/\n\s*/g, "\n"));

async function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (catalog import)" } });
    if (res.ok) return res.text();
    if (attempt === 3) throw new Error(`${res.status} ${url}`);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
}

async function listCategory(oldPath) {
  const items = new Map();
  for (let page = 1; page < 50; page++) {
    const html = await get(`${BASE}/${oldPath}.html?product_list_limit=36&p=${page}`);
    const blocks = html.split('class="item product product-item"').slice(1);
    let added = 0;
    for (const b of blocks) {
      const link = b.match(/class="product-item-link"\s+href="([^"]+)"/);
      if (!link || items.has(link[1])) continue;
      const img = b.match(/data-src="([^"]+\/catalog\/product\/[^"]+)"/);
      items.set(link[1], { url: link[1], image: img ? img[1] : null });
      added++;
    }
    if (added === 0) break; // Magento repete a última página quando p passa do fim
  }
  return [...items.values()];
}

async function readProduct(url) {
  const html = await get(url);
  const attr = (label) => {
    const m = html.match(new RegExp(`data-th="${label}">([^<]*)<`));
    return m ? decode(m[1]) : null;
  };
  const name = html.match(/<span class="base" data-ui-id="page-title-wrapper"[^>]*>([^<]+)</);
  const sku = html.match(/itemprop="sku">([^<]+)</);
  const desc = html.match(/class="product attribute description">\s*<div class="value"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
  return {
    name: name ? decode(name[1]) : null,
    sku: sku ? decode(sku[1]) : null,
    brand: attr("Fabricante"),
    inStock: /class="stock available"/.test(html),
    description: desc ? stripTags(desc[1]) : "",
  };
}

async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return out;
}

const seen = new Set();
const products = [];
for (const [category, oldPath] of Object.entries(CATEGORIES)) {
  const list = (await listCategory(oldPath)).filter((p) => !seen.has(p.url));
  list.forEach((p) => seen.add(p.url));
  console.log(`${category}: ${list.length} produtos`);
  const details = await pool(list, 6, async (p) => {
    try {
      return { ...p, ...(await readProduct(p.url)) };
    } catch (e) {
      console.warn("falhou", p.url, e.message);
      return null;
    }
  });
  for (const d of details) {
    if (!d?.name) continue;
    const slug = d.url.replace(`${BASE}/`, "").replace(/\.html$/, "");
    products.push({
      slug,
      sku: d.sku,
      name: d.name,
      category,
      brand: d.brand && !/^n[aã]o$/i.test(d.brand) ? d.brand.toUpperCase() : null,
      image: d.image,
      inStock: d.inStock,
      description: d.description,
    });
  }
}

await mkdir("data", { recursive: true });
await writeFile("data/products.json", JSON.stringify(products, null, 1));
console.log(`total: ${products.length}`);
