import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import type { Profile } from '../../types';
import { fullName } from '../../utils/profile';
import { kiffsArePublic } from '../../utils/settings';
import ThemeToggle from '../ThemeToggle';
import CvDownload from './CvDownload';

const baseLinks = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/a-propos', label: 'À propos' },
  { to: '/competences', label: 'Compétences' },
  { to: '/parcours', label: 'Parcours' },
  { to: '/projets', label: 'Projets' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/mes-kiff', label: 'Mes kiff' },
  { to: '/contact', label: 'Contact' },
];

export default function Header({
  profile,
  settings,
}: {
  profile: Profile;
  settings?: Record<string, string>;
}) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const role = settings?.header_role || 'Data Engineer · UTT';
  const name = fullName(profile);
  const links = kiffsArePublic(settings)
    ? baseLinks
    : baseLinks.filter((l) => l.to !== '/mes-kiff');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <nav className="container site-header__nav">
        <Link to="/" className="site-header__logo" aria-label={name}>
          <span className="site-header__logo-row">
            <span className="site-header__dot" aria-hidden="true" />
            {name}
          </span>
          <span className="site-header__role">{role}</span>
        </Link>
        <ul className={`site-header__menu${open ? ' is-open' : ''}`}>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? 'nav-active' : '')}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="site-header__actions">
          <CvDownload profile={profile} compact className="btn btn-primary site-header__cv" />
          <ThemeToggle />
          <button
            type="button"
            className="btn btn-ghost site-header__toggle"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
