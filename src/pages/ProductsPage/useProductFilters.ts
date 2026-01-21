// ===========================================
// PRODUCTS PAGE - FILTER HOOK
// ===========================================

import { useState, useMemo, useCallback } from "react";
import type {
  ProductCategory,
  ProductGenre,
  ShoeSize,
  ProductFilters,
} from "@/types";
import type { PriceRange } from "@/components";
import type { ProductsFilterState } from "./types";
import { DEFAULT_FILTER_STATE } from "./constants";

export function useProductFilters() {
  const [searchQuery, setSearchQuery] = useState(
    DEFAULT_FILTER_STATE.searchQuery,
  );
  const [category, setCategory] = useState<ProductCategory | "">(
    DEFAULT_FILTER_STATE.category,
  );
  const [genre, setGenre] = useState<ProductGenre | "">(
    DEFAULT_FILTER_STATE.genre,
  );
  const [selectedSizes, setSelectedSizes] = useState<ShoeSize[]>(
    DEFAULT_FILTER_STATE.selectedSizes,
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    DEFAULT_FILTER_STATE.selectedBrands,
  );
  const [priceRange, setPriceRange] = useState<PriceRange>(
    DEFAULT_FILTER_STATE.priceRange,
  );
  const [sortBy, setSortBy] = useState(DEFAULT_FILTER_STATE.sortBy);

  // Toggle size selection
  const toggleSize = useCallback((size: ShoeSize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }, []);

  // Toggle brand selection
  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((value: ProductCategory | "") => {
    setCategory(value);
  }, []);

  // Handle genre change
  const handleGenreChange = useCallback((value: ProductGenre | "") => {
    setGenre(value);
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery(DEFAULT_FILTER_STATE.searchQuery);
    setCategory(DEFAULT_FILTER_STATE.category);
    setGenre(DEFAULT_FILTER_STATE.genre);
    setSelectedSizes(DEFAULT_FILTER_STATE.selectedSizes);
    setSelectedBrands(DEFAULT_FILTER_STATE.selectedBrands);
    setPriceRange(DEFAULT_FILTER_STATE.priceRange);
    setSortBy(DEFAULT_FILTER_STATE.sortBy);
  }, []);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (category) count++;
    if (genre) count++;
    if (selectedSizes.length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (priceRange.min || priceRange.max) count++;
    if (searchQuery) count++;
    return count;
  }, [category, genre, selectedSizes, selectedBrands, priceRange, searchQuery]);

  // Build API filters object
  const buildApiFilters = useCallback((): ProductFilters => {
    const filters: ProductFilters = {};

    if (category) filters.category = category;
    if (genre) filters.genre = genre;
    if (searchQuery) filters.search = searchQuery;
    if (selectedBrands.length === 1) filters.brand = selectedBrands[0];
    if (priceRange.min) filters.minPrice = Number(priceRange.min);
    if (priceRange.max) filters.maxPrice = Number(priceRange.max);

    return filters;
  }, [category, genre, searchQuery, selectedBrands, priceRange]);

  // Get sort config from sortBy string
  const getSortConfig = useCallback(() => {
    const [field, order] = sortBy.split("-");
    return {
      sortBy: field,
      sortOrder: order as "asc" | "desc",
    };
  }, [sortBy]);

  // Current filter state
  const filterState: ProductsFilterState = {
    searchQuery,
    category,
    genre,
    selectedSizes,
    selectedBrands,
    priceRange,
    sortBy,
  };

  return {
    // State
    filterState,
    searchQuery,
    category,
    genre,
    selectedSizes,
    selectedBrands,
    priceRange,
    sortBy,
    activeFiltersCount,

    // Setters
    setSearchQuery,
    setPriceRange,
    setSortBy,

    // Handlers
    toggleSize,
    toggleBrand,
    handleCategoryChange,
    handleGenreChange,
    clearAllFilters,

    // Utilities
    buildApiFilters,
    getSortConfig,
  };
}
