import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api';

interface AuthContextType {
  token: string | null;
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.me()
      .then((u) => setEmail(u.email))
      .catch(() => {
        localStorage.removeItem('admin_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (e: string, p: string) => {
    const { token: t, email: em } = await api.login(e, p);
    localStorage.setItem('admin_token', t);
    setToken(t);
    setEmail(em);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth hors AuthProvider');
  return ctx;
}
