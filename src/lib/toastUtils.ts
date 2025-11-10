// src/lib/toastUtils.ts
import { toast, Id } from "react-toastify";

// Toast Registry to prevent duplicates
const activeToasts = new Map<string, Id>();

/**
 * Show a toast message once at a time using a unique key
 */
export function showToastOnceStrict(
  key: string,
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
) {
  if (activeToasts.has(key)) return;

  const toastId = toast[type](message, {
    toastId: key, // required to link internally
    autoClose: 2000,
    closeButton: true,
    onClose: () => {
      activeToasts.delete(key); // Clean registry
    },
  });

  activeToasts.set(key, toastId);
}
