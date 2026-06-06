// Starwind Toast API - Vanilla JS implementation
// Works in Astro islands (client-side JS)

export interface ToastOptions {
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

let container: HTMLElement | null = null;

function getContainer() {
  if (container) return container;
  container = document.createElement('div');
  container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
  document.body.appendChild(container);
  return container;
}

function escape(s: string) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function show(message: string, options: ToastOptions = {}) {
  const el = document.createElement('div');
  const variant = options.variant || 'default';
  const bgClass: Record<string, string> = {
    default: 'bg-white border-gray-200',
    destructive: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };
  el.className = `${bgClass[variant]} border rounded-lg shadow-md p-4 max-w-sm`;
  el.innerHTML = `
    <div class="font-semibold text-sm">${escape(message)}</div>
    ${options.description ? `<div class="text-xs text-gray-600 mt-1">${escape(options.description)}</div>` : ''}
  `;
  getContainer().appendChild(el);
  setTimeout(() => el.remove(), options.duration || 3000);
}

export const toast = {
  success: (msg: string, opts?: ToastOptions) => show(msg, { ...opts, variant: 'success' }),
  error: (msg: string, opts?: ToastOptions) => show(msg, { ...opts, variant: 'destructive' }),
  warning: (msg: string, opts?: ToastOptions) => show(msg, { ...opts, variant: 'warning' }),
  info: (msg: string, opts?: ToastOptions) => show(msg, { ...opts, variant: 'default' }),
};