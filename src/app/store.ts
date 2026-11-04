import { configureStore } from "@reduxjs/toolkit";
import products from "../features/products/productsSlice";
import cart from "../features/cart/cartSlice";
import { writeStorage } from "../utils/storage";
export const store = configureStore({ reducer: { products, cart } });
store.subscribe(() =>
  writeStorage("shopmini-cart", store.getState().cart.items),
);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
