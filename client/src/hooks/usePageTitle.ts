import { useEffect } from 'react';

const SITE = 'Housséni YABRE';

export function usePageTitle(page?: string) {
  useEffect(() => {
    document.title = page
      ? `${page} | ${SITE} - Data Engineer`
      : `${SITE} - Data Engineer`;
  }, [page]);
}
