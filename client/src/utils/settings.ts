export function kiffsArePublic(settings?: Record<string, string> | null) {
  return (settings?.kiffs_public ?? 'true') !== 'false';
}
