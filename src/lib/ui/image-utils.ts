/**
 * Image URL resolution utilities for card components.
 * Implements the canonical resolution chain: thumbnail > profileImageId > first imageId.
 */

/**
 * Resolve a media ID to its public URL.
 */
export function mediaUrl(mediaId: string | null | undefined): string | null {
  if (!mediaId) return null;
  return `/api/media/${mediaId}`;
}

/**
 * Resolve the best available image for an entity.
 * Priority: thumbnail > profileImageId > first imageId.
 *
 * Returns null if none of the inputs are available.
 */
export function resolveEntityImage(
  thumbnail: string | null | undefined,
  profileImageId?: string | null,
  imageIds?: string[] | null,
): string | null {
  if (thumbnail) return thumbnail;
  if (profileImageId) return mediaUrl(profileImageId);
  const firstImageId = imageIds?.[0];
  if (firstImageId) return mediaUrl(firstImageId);
  return null;
}
