// ===========================================
// COMPONENTS - DIALOG
// ===========================================

import { useEffect, useRef, useCallback } from "react";
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";
import styles from "./Dialog.module.css";

type DialogVariant = "default" | "danger" | "warning" | "success" | "info";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  variant?: DialogVariant;
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}

interface DialogActionsProps {
  children: React.ReactNode;
}

interface DialogConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  isLoading?: boolean;
}

const variantIcons = {
  default: null,
  danger: AlertTriangle,
  warning: AlertCircle,
  success: CheckCircle,
  info: Info,
};

/**
 * Dialog Component - Modal para acciones importantes
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  variant = "default",
  size = "md",
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEscape = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [closeOnEscape, onClose],
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        const firstFocusable = dialogRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  const Icon = variantIcons[variant];

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
    >
      <div ref={dialogRef} className={`${styles.dialog} ${styles[size]}`}>
        {showCloseButton && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        )}

        <div className={styles.content}>
          {Icon && (
            <div className={`${styles.iconWrapper} ${styles[variant]}`}>
              <Icon size={24} />
            </div>
          )}

          <div className={styles.text}>
            <h2 id="dialog-title" className={styles.title}>
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className={styles.description}>
                {description}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Dialog Actions - Container para botones de acción
 */
export function DialogActions({ children }: DialogActionsProps) {
  return <div className={styles.actions}>{children}</div>;
}

/**
 * Dialog Confirm - Variante pre-configurada para confirmaciones
 */
export function DialogConfirm({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: DialogConfirmProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      variant={variant}
      size="sm"
      closeOnOverlay={!isLoading}
      closeOnEscape={!isLoading}
    >
      <DialogActions>
        <button
          className={styles.cancelButton}
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          className={`${styles.confirmButton} ${styles[variant]}`}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : confirmText}
        </button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Dialog Alert - Variante para alertas informativas
 */
interface DialogAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
  variant?: DialogVariant;
}

export function DialogAlert({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "Entendido",
  variant = "info",
}: DialogAlertProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      variant={variant}
      size="sm"
    >
      <DialogActions>
        <button className={styles.primaryButton} onClick={onClose}>
          {buttonText}
        </button>
      </DialogActions>
    </Dialog>
  );
}
