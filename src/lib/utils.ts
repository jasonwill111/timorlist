import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from "nanoid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
    .trim()
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/-+/g, '-');             // Collapse multiple hyphens
}

export function generateUniqueSlug(title: string): string {
  const base = slugify(title).replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `${base}-${nanoid(6)}`;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function buildWhatsAppLink(
  contactNumber: string | null,
  countryCode = '+670',
  text = ''
): string {
  if (!contactNumber) return '';
  const number = contactNumber.replace(/\D/g, '');
  const cc = countryCode.replace('+', '');
  return `https://wa.me/${cc}${number}?text=${encodeURIComponent(text)}`;
}

export function formatUnixTimestamp(unixSeconds: number | null | undefined): string {
  if (!unixSeconds) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(unixSeconds * 1000));
}
