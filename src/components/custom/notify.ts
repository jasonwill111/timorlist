/**
 * Unified notification API
 * Wraps the Starwind Toast API for project-wide use.
 *
 * Usage:
 *   import { notify } from '@/components/custom/notify';
 *   notify.success('Saved!');
 *   notify.error('Failed to save');
 *
 * This abstraction allows us to swap the underlying implementation
 * (e.g., from Starwind to a different library) without changing
 * any business code.
 */

import { toast as starwindToast, type ToastOptions } from '../starwind/toast';

export const notify = {
  success(message: string, options?: ToastOptions) {
    return starwindToast.success(message, options);
  },
  error(message: string, options?: ToastOptions) {
    return starwindToast.error(message, options);
  },
  warning(message: string, options?: ToastOptions) {
    return starwindToast.warning(message, options);
  },
  info(message: string, options?: ToastOptions) {
    return starwindToast.info(message, options);
  },
};
