import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
await mkdir(".qa", { recursive: true });
await build({
  entryPoints: [
    "src/features/cart/cartSlice.ts",
    "src/features/products/productsSlice.ts",
    "src/utils/formatCurrency.ts",
  ],
  bundle: true,
  platform: "node",
  format: "esm",
  outdir: ".qa/unit",
  outbase: "src",
  packages: "external",
});
const cart = await import("../.qa/unit/features/cart/cartSlice.js");
const products = await import("../.qa/unit/features/products/productsSlice.js");
const { shippingPrice } = await import("../.qa/unit/utils/formatCurrency.js");
const { configureStore } = await import("@reduxjs/toolkit");
const store = configureStore({
  reducer: { cart: cart.default, products: products.default },
});
const product = {
  id: 1,
  title: "Test product",
  price: 0.1,
  description: "Unit test only",
  category: "electronics",
  image: "https://example.com/test.png",
};
store.dispatch(cart.addToCart({ product, quantity: 2 }));
store.dispatch(cart.addToCart({ product, quantity: 1 }));
assert.equal(cart.selectCartItems(store.getState()).length, 1);
assert.equal(cart.selectCartTotalQuantity(store.getState()), 3);
assert.equal(cart.selectCartTotalPrice(store.getState()), 0.3);
for (const quantity of [-2, 0, 1.5, NaN])
  store.dispatch(cart.updateQuantity({ productId: 1, quantity }));
assert.equal(cart.selectCartTotalQuantity(store.getState()), 3);
store.dispatch(cart.updateQuantity({ productId: 1, quantity: 5 }));
assert.equal(cart.selectCartTotalPrice(store.getState()), 0.5);
store.dispatch(cart.removeFromCart(1));
assert.equal(cart.selectCartTotalQuantity(store.getState()), 0);
store.dispatch(cart.addToCart({ product, quantity: 1 }));
store.dispatch(cart.clearCart());
assert.equal(cart.selectCartItems(store.getState()).length, 0);
assert.equal(shippingPrice(99.99), 5.99);
assert.equal(shippingPrice(100), 0);
assert.equal(shippingPrice(0), 0);
console.log(
  "PASS: cart merging, quantities, cent arithmetic, removal, clear and shipping threshold",
);
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async () =>
    new Response(JSON.stringify([product]), { status: 200 });
  await store.dispatch(products.fetchProducts());
  assert.equal(store.getState().products.status, "succeeded");
  assert.equal(store.getState().products.items[0].id, 1);
  globalThis.fetch = async () => new Response("Unavailable", { status: 503 });
  await store.dispatch(products.fetchProducts());
  assert.equal(store.getState().products.status, "failed");
  assert.match(store.getState().products.error, /503/);
  globalThis.fetch = async () =>
    new Response(JSON.stringify([{ id: 2 }]), { status: 200 });
  await store.dispatch(products.fetchProducts());
  assert.equal(store.getState().products.status, "failed");
  assert.match(store.getState().products.error, /invalid/);
  globalThis.fetch = async () => {
    throw new Error("Offline");
  };
  await store.dispatch(products.fetchProducts());
  assert.equal(store.getState().products.error, "Offline");
  console.log(
    "PASS: async products success, HTTP rejection, invalid payload and network error",
  );
} finally {
  globalThis.fetch = originalFetch;
}
