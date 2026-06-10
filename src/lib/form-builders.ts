/**
 * HTML builder helpers for admin form islands.
 * Extracted from ProductsFormIsland and ServicePackagesFormIsland per
 * Astro single-responsibility island pattern.
 */
import { escapeHtml } from './sanitize';
import { getPriceUnitsForServiceType } from './constants';
import { productConfig } from './product-config';

// ── Products form builders ────────────────────────────────────────────────

export function buildPriceFieldRow(
  idx: number,
  field: { label: string; value: string; unit: string },
  units: { value: string; label: string }[],
): string {
  const isFirst = idx === 0;
  return `<div class="flex gap-2 items-center price-field-row" data-index="${idx}">
    <input type="text" name="priceLabel_${idx}" value="${escapeHtml(field.label)}" placeholder="Label" class="flex-1 px-2 py-1 border rounded text-xs" />
    <input type="number" name="priceValue_${idx}" value="${escapeHtml(field.value)}" placeholder="0.00" class="w-20 px-2 py-1 border rounded text-xs" step="0.01" />
    <select name="priceUnit_${idx}" class="px-2 py-1 border rounded text-xs bg-background">
      ${units.map(u => `<option value="${u.value}"${u.value === field.unit ? ' selected' : ''}>${escapeHtml(u.label)}</option>`).join('')}
    </select>
    <button type="button" data-action="remove-price-field" class="text-red-500 hover:text-red-600 p-1${isFirst ? ' invisible' : ''}">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>`;
}

export function buildPriceFieldsHtml(
  productType: string,
  existingFields: { label: string; value: string; unit: string }[] = [],
): string {
  const units = getPriceUnitsForServiceType(productType);
  if (!existingFields.length) existingFields.push({ label: '', value: '', unit: '' });
  return existingFields.map((f, i) => buildPriceFieldRow(i, f, units)).join('');
}

export function buildSpecFieldHtml(
  field: { key: string; type: string; label: string; placeholder?: string; options?: string[] },
  value: string,
): string {
  const id = `spec-${field.key}`;
  const v = escapeHtml(Array.isArray(value) ? value.join(', ') : value);
  const ph = field.placeholder ? escapeHtml(field.placeholder) : '';
  if (field.type === 'text') return `<div><label for="${id}" class="block text-xs font-medium text-muted-foreground mb-1">${escapeHtml(field.label)}</label><input type="text" id="${id}" name="spec_${field.key}" value="${v}" placeholder="${ph}" class="w-full px-3 py-2 border rounded-md text-sm" /></div>`;
  if (field.type === 'number') return `<div><label for="${id}" class="block text-xs font-medium text-muted-foreground mb-1">${escapeHtml(field.label)}</label><input type="number" id="${id}" name="spec_${field.key}" value="${v}" placeholder="${ph}" class="w-full px-3 py-2 border rounded-md text-sm" /></div>`;
  if (field.type === 'select') return `<div><label for="${id}" class="block text-xs font-medium text-muted-foreground mb-1">${escapeHtml(field.label)}</label><select id="${id}" name="spec_${field.key}" class="w-full px-3 py-2 border rounded-md text-sm bg-background"><option value="">Select...</option>${(field.options || []).map(o => `<option value="${o}"${value === o ? ' selected' : ''}>${escapeHtml(o.charAt(0).toUpperCase() + o.slice(1).replace('_', ' '))}</option>`).join('')}</select></div>`;
  if (field.type === 'checkbox') return `<div class="flex items-center gap-2"><input type="checkbox" id="${id}" name="spec_${field.key}" value="true"${value ? ' checked' : ''} class="w-4 h-4" /><label for="${id}" class="text-sm">${escapeHtml(field.label)}</label></div>`;
  if (field.type === 'tags') return `<div><label for="${id}" class="block text-xs font-medium text-muted-foreground mb-1">${escapeHtml(field.label)}</label><input type="text" id="${id}" name="spec_${field.key}" value="${v}" placeholder="Comma separated values" class="w-full px-3 py-2 border rounded-md text-sm" /></div>`;
  return '';
}

export function buildMediaThumbnail(
  mediaId: string,
  mediaUrl: string,
  isVideo: boolean,
): string {
  const inner = isVideo
    ? `<video src="${mediaUrl}" class="w-full h-full object-cover" muted /><div class="absolute inset-0 flex items-center justify-center"><svg class="w-6 h-6 text-white" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>`
    : `<img src="${mediaUrl}" class="w-full h-full object-cover" />`;
  return `<div class="relative aspect-square rounded-lg overflow-hidden bg-muted">${inner}
    <button type="button" data-action="remove-media" data-media-id="${mediaId}" class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">x</button>
  </div>`;
}

export function buildAddPriceRowHtml(productType: string, idx: number): string {
  const units = getPriceUnitsForServiceType(productType);
  return `<div class="flex gap-2 items-center price-field-row" data-index="${idx}">
    <input type="text" name="priceLabel_${idx}" placeholder="Label" class="flex-1 px-2 py-1 border rounded text-xs" />
    <input type="number" name="priceValue_${idx}" placeholder="0.00" class="w-20 px-2 py-1 border rounded text-xs" step="0.01" />
    <select name="priceUnit_${idx}" class="px-2 py-1 border rounded text-xs bg-background">${units.map((u: any) => `<option value="${u.value}">${u.label}</option>`).join('')}</select>
    <button type="button" data-action="remove-price-field" class="text-red-500 hover:text-red-600 p-1">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>`;
}
