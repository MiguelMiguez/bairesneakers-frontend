import type { ProductCategory, ProductGenre, ShoeSize } from "@/types";
import type { FilterOption, PriceRange } from "@/components";

// Filter state type
export interface ProductsFilterState {
  searchQuery: string;
  category: ProductCategory | "";
  genre: ProductGenre | "";
  selectedSizes: ShoeSize[];
  selectedBrands: string[];
  priceRange: PriceRange;
  sortBy: string;
}

// Sort option type
export interface SortOption {
  value: string;
  label: string;
}

// Pagination config
export interface PaginationConfig {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Export filter option types
export type CategoryOption = FilterOption<ProductCategory>;
export type GenreOption = FilterOption<ProductGenre>;
