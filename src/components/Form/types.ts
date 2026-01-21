// ===========================================
// FORM COMPONENT - TYPE DEFINITIONS (Enhanced)
// ===========================================

import { ReactNode } from "react";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "file"
  | "date";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FieldConfig {
  name: string;
  label?: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  min?: number;
  max?: number;
  rows?: number;
  pattern?: string;
  icon?: ReactNode;
  helperText?: string;
  className?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
}

export interface FormSectionConfig {
  title?: string;
  subtitle?: string;
  fields: FieldConfig[];
  columns?: 1 | 2 | 3;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = Record<string, any>;

export interface FormConfig {
  sections?: FormSectionConfig[];
  fields?: FieldConfig[];
  values: FormValues;
  onChange: (name: string, value: unknown) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  submitIcon?: ReactNode;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  isValid?: boolean;
  error?: string | null;
  successMessage?: string | null;
  className?: string;
  children?: ReactNode;
  hideSubmit?: boolean;
}

// Simplified aliases for common use
export type FormProps = FormConfig;

export interface FormFieldProps {
  config: FieldConfig;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}

export interface FormSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

// Common form field configurations
export const commonFields = {
  name: (overrides?: Partial<FieldConfig>): FieldConfig => ({
    name: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Tu nombre",
    required: true,
    ...overrides,
  }),
  email: (overrides?: Partial<FieldConfig>): FieldConfig => ({
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "tu@email.com",
    required: true,
    autoComplete: "email",
    ...overrides,
  }),
  phone: (overrides?: Partial<FieldConfig>): FieldConfig => ({
    name: "phone",
    label: "Teléfono",
    type: "tel",
    placeholder: "+54 11 1234-5678",
    autoComplete: "tel",
    ...overrides,
  }),
  password: (overrides?: Partial<FieldConfig>): FieldConfig => ({
    name: "password",
    label: "Contraseña",
    type: "password",
    placeholder: "••••••••",
    required: true,
    autoComplete: "current-password",
    ...overrides,
  }),
  message: (overrides?: Partial<FieldConfig>): FieldConfig => ({
    name: "message",
    label: "Mensaje",
    type: "textarea",
    placeholder: "Escribe tu mensaje...",
    rows: 4,
    ...overrides,
  }),
  street: (overrides?: Partial<FieldConfig>): FieldConfig => ({
    name: "street",
    label: "Calle",
    type: "text",
    placeholder: "Nombre de la calle",
    required: true,
    autoComplete: "street-address",
    ...overrides,
  }),
  city: (overrides?: Partial<FieldConfig>): FieldConfig => ({
    name: "city",
    label: "Ciudad",
    type: "text",
    placeholder: "Ciudad",
    required: true,
    autoComplete: "address-level2",
    ...overrides,
  }),
  state: (overrides?: Partial<FieldConfig>): FieldConfig => ({
    name: "state",
    label: "Provincia",
    type: "text",
    placeholder: "Provincia",
    required: true,
    autoComplete: "address-level1",
    ...overrides,
  }),
  zipCode: (overrides?: Partial<FieldConfig>): FieldConfig => ({
    name: "zipCode",
    label: "Código Postal",
    type: "text",
    placeholder: "C.P.",
    required: true,
    autoComplete: "postal-code",
    ...overrides,
  }),
};
