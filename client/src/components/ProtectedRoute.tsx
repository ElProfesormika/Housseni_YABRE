import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="container" style={{ padding: '4rem' }}>Chargement…</div>;
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
