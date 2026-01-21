// ===========================================
// FILTERS - SIZE FILTER COMPONENT
// ===========================================

import type { SizeFilterProps } from "./types";
import styles from "./Filters.module.css";

export function SizeFilter({
  label = "Talle",
  sizes,
  selected,
  onChange,
}: SizeFilterProps) {
  return (
    <div className={styles.filterSection}>
      <label className={styles.filterLabel}>{label}</label>
      <div className={styles.sizeGrid}>
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            className={`${styles.sizeChip} ${selected.includes(size) ? styles.sizeChipActive : ""}`}
            onClick={() => onChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
