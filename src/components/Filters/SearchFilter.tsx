// ===========================================
// FILTERS - SEARCH FILTER COMPONENT
// ===========================================

import { Search, X } from "lucide-react";
import type { SearchFilterProps } from "./types";
import styles from "./Filters.module.css";

export function SearchFilter({
  value,
  onChange,
  placeholder = "Buscar productos...",
}: SearchFilterProps) {
  return (
    <div className={styles.filterSection}>
      <label className={styles.filterLabel}>Buscar</label>
      <div className={styles.searchInputWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.searchInput}
        />
        {value && (
          <button
            className={styles.clearSearchBtn}
            onClick={() => onChange("")}
            type="button"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
