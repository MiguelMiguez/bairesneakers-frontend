// ===========================================
// FORM COMPONENT - FORM SECTION
// ===========================================

import { FormSectionProps } from "./types";
import styles from "./Form.module.css";

export function FormSection({
  title,
  subtitle,
  children,
  columns = 1,
  className,
}: FormSectionProps) {
  const sectionClasses = [styles.section, className].filter(Boolean).join(" ");

  const contentClasses = [
    styles.sectionContent,
    columns === 2 && styles.twoColumns,
    columns === 3 && styles.threeColumns,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sectionClasses}>
      {(title || subtitle) && (
        <div className={styles.sectionHeader}>
          {title && <h3 className={styles.sectionTitle}>{title}</h3>}
          {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={contentClasses}>{children}</div>
    </div>
  );
}
