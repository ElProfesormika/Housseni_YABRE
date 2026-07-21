import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, ExternalLink } from 'lucide-react';
import { api } from '../../api';
import type { PortfolioData } from '../../types';
import { fullName } from '../../utils/profile';

export default function AdminDashboard() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.getPortfolio().then(setData).catch(() => {});
    api
      .getMessages()
      .then((msgs) => setUnread(msgs.filter((m) => !m.read_status).length))
      .catch(() => {});
  }, []);

  const stats = data
    ? [
        { label: 'Projets', count: data.projects.length, to: '/admin/projects' },
        { label: 'Expériences', count: data.experiences.length, to: '/admin/experiences' },
        { label: 'Compétences', count: data.skills.length, to: '/admin/skills' },
        { label: 'Certifications', count: data.certifications.length, to: '/admin/certifications' },
      ]
    : [];

  const name = data ? fullName(data.profile) : 'Housséni YABRE';

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Tableau de bord</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Bienvenue {name} — gérez votre portfolio Data Engineer & IA.
      </p>

      {unread > 0 && (
        <Link to="/admin/messages" className="card alert-banner" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
          <Inbox size={24} style={{ color: 'var(--accent)' }} />
          <span>
            <strong>{unread} message(s)</strong> non lu(s) — cliquez pour voir
          </span>
        </Link>
      )}

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {stats.map((s) => (
          <Link key={s.to} to={s.to} className="card" style={{ textDecoration: 'none' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.label}</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>{s.count}</p>
          </Link>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Actions rapides</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/admin/profile" style={{ color: 'var(--accent)' }}>Modifier le profil Housséni YABRE</Link></li>
            <li><Link to="/admin/projects" style={{ color: 'var(--accent)' }}>Ajouter un projet</Link></li>
            <li><Link to="/admin/messages" style={{ color: 'var(--accent)' }}>Messages contact</Link></li>
            <li><Link to="/admin/settings" style={{ color: 'var(--accent)' }}>Paramètres du site</Link></li>
          </ul>
        </div>
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Aperçu site</h2>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <ExternalLink size={18} /> Ouvrir le portfolio public
          </a>
        </div>
      </div>
    </div>
  );
}
