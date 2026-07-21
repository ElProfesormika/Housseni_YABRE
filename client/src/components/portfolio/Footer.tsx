import { Link } from 'react-router-dom';
import type { Profile, SocialLink } from '../../types';
import { fullName } from '../../utils/profile';
import SocialIcons from './SocialIcons';

const footerLinks = [
  { to: '/a-propos', label: 'À propos' },
  { to: '/competences', label: 'Compétences' },
  { to: '/parcours', label: 'Parcours' },
  { to: '/projets', label: 'Projets' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer({
  profile,
  socials,
  footerText,
}: {
  profile: Profile;
  socials: SocialLink[];
  footerText: string;
}) {
  const name = fullName(profile);
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__name">{name}</p>
          <p className="site-footer__role">Data Engineer & Ingénieur IA</p>
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
