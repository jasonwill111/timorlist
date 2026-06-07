/**
 * XSS Sanitization and HTML escaping utilities.
 * Canonical location for all escaping functions used in the codebase.
 *
 * Replaces duplicate escapeHtml implementations in:
 * - src/lib/utils.ts (escapeHtml, escapeHtmlServer)
  * - Inline <script> tag duplicates in client components
 */
import DOMPurify from 'dompurify';

/**
 * Escape HTML special characters for safe server-side rendering.
 * Works in both browser and server contexts (does not use DOM).
 */
export function escapeHtml(str: string | null | undefined): string {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape a value for safe inclusion inside an HTML attribute.
 * Uses single-quote delimiters; escapes both single and double quotes.
 * Equivalent to escapeHtml but documented intent: attribute context.
 */
export function sanitizeForAttribute(value: string | null | undefined): string {
  return escapeHtml(value);
}

/**
 * Escape a value for safe inclusion as text inside an HTML element
 * (interpolated between tags). This is functionally identical to
 * escapeHtml - the more semantic name documents intent.
 */
export function sanitizeForInnerHtml(value: string | null | undefined): string {
  return escapeHtml(value);
}

/**
 * Sanitize full HTML content using DOMPurify to allow safe formatting tags
 * while stripping dangerous elements (scripts, event handlers, etc).
 */
export function sanitizeHtml(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
  });
}

/**
 * Sanitize plain text (strip all HTML).
 */
export function sanitizeText(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
