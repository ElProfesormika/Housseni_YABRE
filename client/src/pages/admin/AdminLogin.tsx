import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <form onSubmit={handleSubmit} className="card" style={{ width: 'min(400px, 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Lock size={40} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.5rem' }}>Administration</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Portfolio Housséni YABRE — connexion admin</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Retour au portfolio</a>
        </p>
      </form>
    </div>
  );
}
