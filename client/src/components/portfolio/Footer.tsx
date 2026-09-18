import { Link } from 'react-router-dom';
import type { Profile, SocialLink } from '../../types';
import { fullName } from '../../utils/profile';
import { kiffsArePublic } from '../../utils/settings';
import SocialIcons from './SocialIcons';
import CvDownload from './CvDownload';

const baseFooterLinks = [
  { to: '/a-propos', label: 'À propos' },
  { to: '/competences', label: 'Compétences' },
  { to: '/parcours', label: 'Parcours' },
  { to: '/projets', label: 'Projets' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/mes-kiff', label: 'Mes kiff' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer({
  profile,
  socials,
  footerText,
  settings,
}: {
  profile: Profile;
  socials: SocialLink[];
  footerText: string;
  settings?: Record<string, string>;
}) {
  const name = fullName(profile);
  const footerLinks = kiffsArePublic(settings)
    ? baseFooterLinks
    : baseFooterLinks.filter((l) => l.to !== '/mes-kiff');
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__name">{name}</p>
          <p className="site-footer__role">{profile.title}</p>
          <CvDownload profile={profile} className="btn btn-ghost" />
          <SocialIcons links={socials} />
        </div>
        <nav className="site-footer__nav">
          {footerLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="site-footer__copy container">
        {footerText || `© ${new Date().getFullYear()} ${name}. Tous droits réservés.`}
      </p>
    </footer>
  );
}
