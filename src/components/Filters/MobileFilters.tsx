// ===========================================
// FILTERS - MOBILE FILTERS MODAL
// ===========================================

import { useState, useEffect } from "react";
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
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  // Convert brands to options format
  const brandOptions: FilterOption<string>[] = brands.map((brand) => ({
    value: brand,
    label: brand,
  }));

  return (
    <div
      className={`${styles.mobileFiltersOverlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.mobileFilters} ${isClosing ? styles.panelClosing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.mobileFiltersHeader}>
          <h3>Filtros</h3>
          <button
            onClick={handleClose}
            type="button"
            aria-label="Cerrar filtros"
          >
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
            onClick={handleClose}
          >
            Ver {resultsCount} productos
          </button>
        </div>
      </div>
    </div>
  );
}
