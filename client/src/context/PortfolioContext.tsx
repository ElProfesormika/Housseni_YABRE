import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api';
import type { PortfolioData } from '../types';

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
  error: string;
  refresh: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .getPortfolio()
      .then((d) => {
        setData(d);
        setError('');
        if (d.settings.site_name) document.title = d.settings.site_name;
        if (d.settings.theme_accent) document.documentElement.style.setProperty('--accent', d.settings.theme_accent);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refresh: load }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio hors PortfolioProvider');
  return ctx;
}
