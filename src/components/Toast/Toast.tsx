// ===========================================
// COMPONENTS - TOAST PROVIDER
// ===========================================

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a1a1a",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "0.9rem",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}

// Re-export toast for convenience
export { toast } from "react-hot-toast";
