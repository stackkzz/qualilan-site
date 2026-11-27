// Checagem rápida de paginate/sortProducts: npx tsx scripts/check-catalog.mts
import assert from "node:assert/strict";
import { complementsFor, paginate, parseSort, sortProducts, type Product } from "../lib/catalog";

const p = (name: string, inStock = true, sku = name): Product =>
  ({ id: name, slug: name, sku, name, category: "x", brand: null, image: null, inStock, description: "", mfrCode: null, unit: null, subcategory: null });

const list = Array.from({ length: 50 }, (_, i) => p(`Item ${i + 1}`, i % 2 === 0));
assert.equal(paginate(list).pages, 3);
assert.equal(paginate(list, "3").items.length, 2);
assert.equal(paginate(list, "99").page, 3);
assert.equal(paginate(list, "abc").page, 1);
assert.equal(paginate([], "2").page, 1);
assert.equal(parseSort("xyz"), "disponiveis");
assert.deepEqual(sortProducts([p("Item 10"), p("Item 2")], "az").map((x) => x.name), ["Item 2", "Item 10"]);
assert.equal(sortProducts([p("B", false), p("A", true)], "disponiveis")[0].name, "A");
console.log("ok");

// complementsFor: outra subcategoria da mesma categoria primeiro, depois categoria complementar; nunca o próprio produto.
{
  const mk = (slug: string, category: string, subcategory: string | null, brand: string | null = null): Product => ({
    ...p(slug),
    category,
    subcategory,
    brand,
  });
  const cabo = mk("cabo", "cabos-lan", "Cabo Cat.6", "Lightera");
  const all = [
    cabo,
    mk("cabo2", "cabos-lan", "Cabo Cat.6", "Lightera"),
    mk("cabo5e", "cabos-lan", "Cabo Cat.5E", "Lightera"),
    mk("patch", "cabos-lan", "Patch cord Cat.6", "Lightera"),
    mk("panel-outra", "cabos-lan", "Patch panel", "Outra"),
    mk("panel", "cabos-lan", "Patch panel", "Lightera"),
    mk("switch", "switches", "PoE", "TP-Link"),
  ];
  const got = complementsFor(cabo, all).map((x) => x.slug);
  assert.deepEqual(got, ["patch", "panel", "switch"]);
  // Switch: outras subcategorias de switch são substitutos, então só entra categoria complementar.
  const sw = mk("sw", "switches", "PoE", "TP-Link");
  const got2 = complementsFor(sw, [...all, sw, mk("sw2", "switches", "Gerenciável", "TP-Link")]).map((x) => x.slug);
  assert.ok(!got2.includes("sw2") && got2[0] === "cabo");
}
console.log("complementos ok");
