// ===========================================
// FILTERS - PRICE FILTER COMPONENT
// ===========================================

import type { PriceFilterProps } from "./types";
import styles from "./Filters.module.css";

export function PriceFilter({
  label = "Precio",
  value,
  onChange,
}: PriceFilterProps) {
  return (
    <div className={styles.filterSection}>
      <label className={styles.filterLabel}>{label}</label>
      <div className={styles.priceInputs}>
        <div className={styles.priceInputWrapper}>
          <span className={styles.currencySymbol}>$</span>
          <input
            type="number"
            placeholder="Min"
            value={value.min}
            onChange={(e) => onChange({ ...value, min: e.target.value })}
            className={styles.priceInput}
          />
        </div>
        <span className={styles.priceSeparator}>—</span>
        <div className={styles.priceInputWrapper}>
          <span className={styles.currencySymbol}>$</span>
          <input
            type="number"
            placeholder="Max"
            value={value.max}
            onChange={(e) => onChange({ ...value, max: e.target.value })}
            className={styles.priceInput}
          />
        </div>
      </div>
    </div>
  );
}
