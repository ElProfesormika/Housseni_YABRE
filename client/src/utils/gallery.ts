/** Parse gallery field stored as JSON array or comma-separated URLs. */
export function parseGalleryUrls(value?: string | null): string[] {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    /* fallback */
  }
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
