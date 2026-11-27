// Checagem rápida de paginate/sortProducts: npx tsx scripts/check-catalog.mts
import assert from "node:assert/strict";
import { paginate, parseSort, sortProducts, type Product } from "../lib/catalog";

const p = (name: string, inStock = true, sku = name): Product =>
  ({ id: name, slug: name, sku, name, category: "x", brand: null, image: null, inStock, description: "" });

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
