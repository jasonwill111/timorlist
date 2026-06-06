/**
 * Toast API — dispatches a 'toast' custom event on window.
 * The `<ToastContainer />` component (mounted in AdminLayout / verify page)
 * listens for this event and renders the toast UI.
 *
 * Usage from any client script:
 *   import { toast } from "@/lib/toast";
 *   toast.success("Saved!");
 *   toast.error("Failed to save", { description: "Try again" });
 */

export type ToastVariant = "default" | "destructive" | "success" | "warning";

export interface ToastDetail {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

function emit(detail: ToastDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("toast", { detail }));
}

function normalize(messageOrDetail: string | ToastDetail, options?: Omit<ToastDetail, "title">): ToastDetail {
  if (typeof messageOrDetail === "string") {
    return { title: messageOrDetail, ...options };
  }
  return messageOrDetail;
}

export const toast = {
  success(message: string | ToastDetail, options?: Omit<ToastDetail, "title" | "variant">): void {
    const detail = normalize(message, options);
    emit({ ...detail, variant: "success" });
  },
  error(message: string | ToastDetail, options?: Omit<ToastDetail, "title" | "variant">): void {
    const detail = normalize(message, options);
    emit({ ...detail, variant: "destructive" });
  },
  warning(message: string | ToastDetail, options?: Omit<ToastDetail, "title" | "variant">): void {
    const detail = normalize(message, options);
    emit({ ...detail, variant: "warning" });
  },
  info(message: string | ToastDetail, options?: Omit<ToastDetail, "title" | "variant">): void {
    const detail = normalize(message, options);
    emit({ ...detail, variant: "default" });
  },
};
