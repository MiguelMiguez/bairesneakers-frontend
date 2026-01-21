// ===========================================
// FILTERS - TYPE DEFINITIONS
// ===========================================

import type { ShoeSize, ProductCategory, ProductGenre } from "@/types";

// Base option type for dropdowns and chip groups
export interface FilterOption<T = string> {
  value: T;
  label: string;
}

// Price range type
export interface PriceRange {
  min: string;
  max: string;
}

// Filter section props
export interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface ChipFilterProps<T = string> {
  label: string;
  options: FilterOption<T>[];
  selected: T | T[];
  onChange: (value: T) => void;
  allowAll?: boolean;
  allLabel?: string;
  multiple?: boolean;
}

export interface SizeFilterProps {
  label?: string;
  sizes: ShoeSize[];
  selected: ShoeSize[];
  onChange: (size: ShoeSize) => void;
}

export interface PriceFilterProps {
  label?: string;
  value: PriceRange;
  onChange: (value: PriceRange) => void;
}

// Complete filter panel props
export interface FilterPanelProps {
  // Search
  searchQuery: string;
  onSearchChange: (value: string) => void;
  // Category
  category: ProductCategory | "";
  onCategoryChange: (value: ProductCategory | "") => void;
  categoryOptions: FilterOption<ProductCategory>[];
  // Genre
  genre: ProductGenre | "";
  onGenreChange: (value: ProductGenre | "") => void;
  genreOptions: FilterOption<ProductGenre>[];
  // Brands
  brands: string[];
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  // Sizes
  sizes: ShoeSize[];
  selectedSizes: ShoeSize[];
  onSizeToggle: (size: ShoeSize) => void;
  // Price
  priceRange: PriceRange;
  onPriceChange: (value: PriceRange) => void;
  // Actions
  activeFiltersCount: number;
  onClearFilters: () => void;
}

// Mobile filter modal props
export interface MobileFiltersProps extends FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  resultsCount: number;
}
