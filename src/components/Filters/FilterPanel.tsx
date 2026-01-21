// ===========================================
// FILTERS - FILTER PANEL COMPONENT
// ===========================================

import { X, SlidersHorizontal } from "lucide-react";
import { SearchFilter } from "./SearchFilter";
import { ChipFilter } from "./ChipFilter";
import { SizeFilter } from "./SizeFilter";
import { PriceFilter } from "./PriceFilter";
import type { FilterPanelProps, FilterOption } from "./types";
import styles from "./Filters.module.css";

export function FilterPanel({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  categoryOptions,
  genre,
  onGenreChange,
  genreOptions,
  brands,
  selectedBrands,
  onBrandToggle,
  sizes,
  selectedSizes,
  onSizeToggle,
  priceRange,
  onPriceChange,
  activeFiltersCount,
  onClearFilters,
}: FilterPanelProps) {
  // Convert brands to options format
  const brandOptions: FilterOption<string>[] = brands.map((brand) => ({
    value: brand,
    label: brand,
  }));

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterPanelHeader}>
        <SlidersHorizontal size={20} />
        <span>Filtros</span>
      </div>

      <SearchFilter value={searchQuery} onChange={onSearchChange} />

      <ChipFilter
        label="Categoría"
        options={categoryOptions}
        selected={category}
        onChange={onCategoryChange}
        allowAll
        allLabel="Todas"
      />

      <ChipFilter
        label="Género"
        options={genreOptions}
        selected={genre}
        onChange={onGenreChange}
        allowAll
        allLabel="Todos"
      />

      <ChipFilter
        label="Marca"
        options={brandOptions}
        selected={selectedBrands}
        onChange={onBrandToggle}
        multiple
      />

      <SizeFilter
        sizes={sizes}
        selected={selectedSizes}
        onChange={onSizeToggle}
      />

      <PriceFilter value={priceRange} onChange={onPriceChange} />

      {activeFiltersCount > 0 && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClearFilters}
        >
          <X size={16} />
          Limpiar filtros ({activeFiltersCount})
        </button>
      )}
    </div>
  );
}
