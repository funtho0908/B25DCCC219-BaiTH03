import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isProduct, type Product } from "../../types";
interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://fakestoreapi.com/products", {
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok)
        throw new Error(
          `Store returned HTTP ${response.status}. Please try again.`,
        );
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.every(isProduct))
        throw new Error("The store returned invalid product data.");
      return data;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to connect to the store.",
      );
    }
  },
  {
    condition: (_, { getState }) =>
      (getState() as { products: ProductsState }).products.status !== "loading",
  },
);
const initialState: ProductsState = { items: [], status: "idle", error: null };
export default createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load products.";
      });
  },
}).reducer;
