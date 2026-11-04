export const categories = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];
export const categoryLabel = (name: string) =>
  name === "jewelery"
    ? "Jewelry"
    : name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
export default function CategoryFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label="Filter category"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">All categories</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {categoryLabel(category)}
        </option>
      ))}
    </select>
  );
}
