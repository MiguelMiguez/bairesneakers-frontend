// ===========================================
// FORM COMPONENT - FORM FIELD
// ===========================================

import { FormFieldProps } from "./types";
import styles from "./Form.module.css";

export function FormField({ config, value, onChange }: FormFieldProps) {
  const {
    name,
    label,
    type,
    placeholder,
    required,
    disabled,
    options,
    min,
    max,
    rows,
    icon,
    helperText,
    className,
    fullWidth,
    autoFocus,
    autoComplete,
  } = config;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target;
    let newValue: unknown;

    if (type === "checkbox") {
      newValue = (target as HTMLInputElement).checked;
    } else if (type === "number") {
      newValue = target.value === "" ? "" : Number(target.value);
    } else {
      newValue = target.value;
    }

    onChange(name, newValue);
  };

  const fieldClasses = [
    styles.formGroup,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            value={(value as string) ?? ""}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows || 3}
            autoFocus={autoFocus}
            className={styles.textarea}
          />
        );

      case "select":
        return (
          <select
            id={name}
            name={name}
            value={(value as string) ?? ""}
            onChange={handleChange}
            required={required}
            disabled={disabled}
            className={styles.select}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={(value as boolean) ?? false}
              onChange={handleChange}
              disabled={disabled}
              className={styles.checkbox}
            />
            <span>{label}</span>
          </label>
        );

      case "radio":
        return (
          <div className={styles.radioGroup}>
            {options?.map((opt) => (
              <label key={opt.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={handleChange}
                  disabled={disabled}
                  className={styles.radio}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <div className={styles.inputWrapper}>
            {icon && <span className={styles.inputIcon}>{icon}</span>}
            <input
              type={type}
              id={name}
              name={name}
              value={(value as string | number) ?? ""}
              onChange={handleChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              min={min}
              max={max}
              autoFocus={autoFocus}
              autoComplete={autoComplete}
              className={`${styles.input} ${icon ? styles.hasIcon : ""}`}
            />
          </div>
        );
    }
  };

  if (type === "checkbox") {
    return <div className={fieldClasses}>{renderInput()}</div>;
  }

  return (
    <div className={fieldClasses}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {renderInput()}
      {helperText && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
}
