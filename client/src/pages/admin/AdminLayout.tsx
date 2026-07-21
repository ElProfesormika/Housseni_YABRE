import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Briefcase,
  Award,
  GraduationCap,
  Share2,
  Settings,
  LogOut,
  ExternalLink,
  Wrench,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const nav = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/admin/profile', icon: User, label: 'Profil' },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projets' },
  { to: '/admin/experiences', icon: Briefcase, label: 'Expériences' },
  { to: '/admin/skills', icon: Wrench, label: 'Compétences' },
  { to: '/admin/certifications', icon: Award, label: 'Certifications' },
  { to: '/admin/education', icon: GraduationCap, label: 'Formation' },
  { to: '/admin/social', icon: Share2, label: 'Réseaux' },
  { to: '/admin/messages', icon: Inbox, label: 'Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
];

export default function AdminLayout() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>Housséni YABRE</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin portfolio</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{email}</p>
          </div>
          <ThemeToggle />
        </div>
        <nav style={{ flex: 1 }}>
          {nav.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link">
          <ExternalLink size={18} /> Voir le site
        </a>
        <button
          type="button"
          className="admin-nav-link"
          style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', marginTop: '0.5rem' }}
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
