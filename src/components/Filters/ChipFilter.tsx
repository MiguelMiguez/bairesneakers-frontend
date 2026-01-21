// ===========================================
// FILTERS - CHIP FILTER COMPONENT
// ===========================================

import type { ChipFilterProps } from "./types";
import styles from "./Filters.module.css";

export function ChipFilter<T extends string | number>({
  label,
  options,
  selected,
  onChange,
  allowAll = false,
  allLabel = "Todos",
  multiple = false,
}: ChipFilterProps<T>) {
  const isSelected = (value: T): boolean => {
    if (multiple && Array.isArray(selected)) {
      return selected.includes(value);
    }
    return selected === value;
  };

  const isAllSelected = (): boolean => {
    if (multiple && Array.isArray(selected)) {
      return selected.length === 0;
    }
    return selected === ("" as T);
  };

  return (
    <div className={styles.filterSection}>
      <label className={styles.filterLabel}>{label}</label>
      <div className={styles.chipGroup}>
        {allowAll && (
          <button
            type="button"
            className={`${styles.chip} ${isAllSelected() ? styles.chipActive : ""}`}
            onClick={() => onChange("" as T)}
          >
            {allLabel}
          </button>
        )}
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            className={`${styles.chip} ${isSelected(option.value) ? styles.chipActive : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
