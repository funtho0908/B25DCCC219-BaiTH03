export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );
export const shippingPrice = (subtotal: number) =>
  subtotal === 0 || subtotal >= 100 ? 0 : 5.99;
