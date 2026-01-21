// ===========================================
// FILTERS - MOBILE FILTERS MODAL
// ===========================================

import { X } from "lucide-react";
import { SearchFilter } from "./SearchFilter";
import { ChipFilter } from "./ChipFilter";
import { SizeFilter } from "./SizeFilter";
import { PriceFilter } from "./PriceFilter";
import type { MobileFiltersProps, FilterOption } from "./types";
import styles from "./Filters.module.css";

export function MobileFilters({
  isOpen,
  onClose,
  resultsCount,
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
}: MobileFiltersProps) {
  if (!isOpen) return null;

  // Convert brands to options format
  const brandOptions: FilterOption<string>[] = brands.map((brand) => ({
    value: brand,
    label: brand,
  }));

  return (
    <div className={styles.mobileFiltersOverlay} onClick={onClose}>
      <div
        className={styles.mobileFilters}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.mobileFiltersHeader}>
          <h3>Filtros</h3>
          <button onClick={onClose} type="button" aria-label="Cerrar filtros">
            <X size={24} />
          </button>
        </div>

        <div className={styles.mobileFiltersContent}>
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

        <div className={styles.mobileFiltersFooter}>
          <button
            type="button"
            className={styles.applyFiltersBtn}
            onClick={onClose}
          >
            Ver {resultsCount} productos
          </button>
        </div>
      </div>
    </div>
  );
}
