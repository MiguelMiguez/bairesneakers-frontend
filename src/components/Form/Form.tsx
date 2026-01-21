// ===========================================
// FORM COMPONENT - MAIN FORM (Enhanced)
// ===========================================

import { Loader2, CheckCircle } from "lucide-react";
import { FormProps, FieldConfig, FormSectionConfig } from "./types";
import { FormField } from "./FormField";
import { FormSection } from "./FormSection";
import styles from "./Form.module.css";

export function Form({
  fields,
  sections,
  values,
  onChange,
  onSubmit,
  submitLabel = "Enviar",
  submitIcon,
  cancelLabel,
  onCancel,
  isLoading = false,
  isValid = true,
  error,
  successMessage,
  className,
  children,
  hideSubmit = false,
}: FormProps) {
  const renderField = (fieldConfig: FieldConfig) => (
    <FormField
      key={fieldConfig.name}
      config={fieldConfig}
      value={values[fieldConfig.name]}
      onChange={onChange}
    />
  );

  const renderSection = (sectionConfig: FormSectionConfig, index: number) => (
    <FormSection
      key={index}
      title={sectionConfig.title}
      subtitle={sectionConfig.subtitle}
      columns={sectionConfig.columns}
    >
      {sectionConfig.fields.map(renderField)}
    </FormSection>
  );

  // Show success message if provided
  if (successMessage) {
    return (
      <div
        className={`${styles.form} ${styles.successState} ${className || ""}`}
      >
        <div className={styles.successMessage}>
          <CheckCircle size={48} />
          <p>{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`${styles.form} ${className || ""}`}>
      {/* Render simple fields if provided */}
      {fields && fields.length > 0 && (
        <div className={styles.fieldsContainer}>{fields.map(renderField)}</div>
      )}

      {/* Render sections if provided */}
      {sections && sections.length > 0 && sections.map(renderSection)}

      {/* Custom children content */}
      {children}

      {/* Error message */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Actions */}
      {!hideSubmit && (
        <div className={styles.formActions}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              {cancelLabel || "Cancelar"}
            </button>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !isValid}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                Procesando...
              </>
            ) : (
              <>
                {submitIcon}
                {submitLabel}
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
