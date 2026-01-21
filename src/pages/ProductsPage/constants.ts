// ===========================================
// PRODUCTS PAGE - CONSTANTS
// ===========================================

import type { ProductCategory, ProductGenre, ShoeSize } from "@/types";
import type { CategoryOption, GenreOption, SortOption } from "./types";

// Category options
export const CATEGORIES: CategoryOption[] = [
  { value: "sneakers", label: "Sneakers" },
  { value: "boots", label: "Boots" },
  { value: "sandals", label: "Sandalias" },
  { value: "casual", label: "Casual" },
] as const;

// Genre options
export const GENRES: GenreOption[] = [
  { value: "masculino", label: "Hombre" },
  { value: "femenino", label: "Mujer" },
  { value: "unisex", label: "Unisex" },
  { value: "niño", label: "Niño" },
  { value: "niña", label: "Niña" },
] as const;

// Available shoe sizes
export const SIZES: ShoeSize[] = [
  35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
];

// Available brands
export const BRANDS: string[] = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Converse",
  "Reebok",
  "Vans",
];

// Sort options
export const SORT_OPTIONS: SortOption[] = [
  { value: "createdAt-desc", label: "Más recientes" },
  { value: "createdAt-asc", label: "Más antiguos" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "name-asc", label: "A - Z" },
  { value: "name-desc", label: "Z - A" },
];

// Default filter state
export const DEFAULT_FILTER_STATE = {
  searchQuery: "",
  category: "" as ProductCategory | "",
  genre: "" as ProductGenre | "",
  selectedSizes: [] as ShoeSize[],
  selectedBrands: [] as string[],
  priceRange: { min: "", max: "" },
  sortBy: "createdAt-desc",
};

// Pagination defaults
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
};
