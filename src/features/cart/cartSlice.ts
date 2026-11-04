import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "../../types";
import { readStorage } from "../../utils/storage";
const stored = readStorage("shopmini-cart");
const items: CartItem[] = [];
if (Array.isArray(stored))
  for (const entry of stored) {
    if (entry && typeof entry === "object") {
      const p = entry as Record<string, unknown>;
      if (
        typeof p.productId === "number" &&
        Number.isInteger(p.productId) &&
        typeof p.title === "string" &&
        typeof p.image === "string" &&
        typeof p.price === "number" &&
        Number.isFinite(p.price) &&
        p.price >= 0 &&
        typeof p.quantity === "number" &&
        Number.isSafeInteger(p.quantity) &&
        p.quantity > 0 &&
        !items.some((item) => item.productId === p.productId)
      )
        items.push(p as unknown as CartItem);
    }
  }
const slice = createSlice({
  name: "cart",
  initialState: { items },
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{ product: Product; quantity: number }>,
    ) {
      const { product, quantity } = action.payload;
      if (!Number.isSafeInteger(quantity) || quantity < 1) return;
      const existing = state.items.find(
        (item) => item.productId === product.id,
      );
      if (existing) {
        if (Number.isSafeInteger(existing.quantity + quantity))
          existing.quantity += quantity;
      } else
        state.items.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity,
        });
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (
        item &&
        Number.isSafeInteger(action.payload.quantity) &&
        action.payload.quantity >= 1
      )
        item.quantity = action.payload.quantity;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});
export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  slice.actions;
type CartRoot = { cart: { items: CartItem[] } };
export const selectCartItems = (state: CartRoot) => state.cart.items;
export const selectCartTotalQuantity = (state: CartRoot) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalPrice = (state: CartRoot) =>
  state.cart.items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0,
  ) / 100;
export default slice.reducer;
