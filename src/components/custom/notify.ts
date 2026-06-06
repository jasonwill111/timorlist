/**
 * Unified notification API
 * Thin wrapper over `@/lib/toast` for project-wide use.
 *
 * Usage:
 *   import { notify } from '@/components/custom/notify';
 *   notify.success('Saved!');
 *   notify.error('Failed to save');
 *
 * This abstraction allows us to swap the underlying implementation
 * (e.g., from CustomEvent to a different library) without changing
 * any business code.
 */
import { toast, type ToastDetail } from '@/lib/toast';

export type ToastOptions = Omit<ToastDetail, 'title' | 'variant'>;

export const notify = {
  success(message: string, options?: ToastOptions) {
    return toast.success(message, options);
  },
  error(message: string, options?: ToastOptions) {
    return toast.error(message, options);
  },
  warning(message: string, options?: ToastOptions) {
    return toast.warning(message, options);
  },
  info(message: string, options?: ToastOptions) {
    return toast.info(message, options);
  },
};
