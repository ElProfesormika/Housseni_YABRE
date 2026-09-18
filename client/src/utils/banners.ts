import type { PageBanner } from '../types';

export function bannerFor(banners: PageBanner[] | undefined, pageKey: string, fallback = ''): string {
  const hit = banners?.find((b) => b.page_key === pageKey);
  return hit?.image_url || fallback;
}
