// ===========================================
// HOOKS - USE FORM (Generic Form Handler)
// ===========================================

import { useState, useCallback, useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = Record<string, any>;

interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Partial<Record<keyof T, string>> | null;
  resetOnSuccess?: boolean;
}

interface UseFormReturn<T extends FormValues> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitError: string | null;
  isValid: boolean;
  handleChange: (name: string, value: unknown) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  setFieldValue: (name: keyof T, value: unknown) => void;
}

export function useForm<T extends FormValues>({
  initialValues,
  onSubmit,
  validate,
  resetOnSuccess = false,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is changed
    setErrors((prev) => {
      if (prev[name as keyof T]) {
        const newErrors = { ...prev };
        delete newErrors[name as keyof T];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const setFieldValue = useCallback((name: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const isValid = useMemo(() => {
    if (validate) {
      const validationErrors = validate(values);
      return !validationErrors || Object.keys(validationErrors).length === 0;
    }
    return true;
  }, [values, validate]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);

      // Validate if validator is provided
      if (validate) {
        const validationErrors = validate(values);
        if (validationErrors && Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
        setIsSuccess(true);

        if (resetOnSuccess) {
          setTimeout(() => {
            setValues(initialValues);
            setIsSuccess(false);
          }, 3000);
        }
      } catch (err) {
        const error = err as Error;
        setSubmitError(error.message || "Ha ocurrido un error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit, resetOnSuccess, initialValues],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setSubmitError(null);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    isSuccess,
    submitError,
    isValid,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setFieldValue,
  };
}
