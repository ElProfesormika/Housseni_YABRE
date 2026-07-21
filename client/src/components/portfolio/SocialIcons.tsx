import { Github, Linkedin, Twitter, Facebook, Instagram, Globe, Mail } from 'lucide-react';
import type { SocialLink } from '../../types';

const iconMap: Record<string, typeof Globe> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  mail: Mail,
  link: Globe,
};

export default function SocialIcons({ links, size = 20 }: { links: SocialLink[]; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {links.map((l) => {
        const Icon = iconMap[l.icon] || iconMap[l.platform.toLowerCase()] || Globe;
        return (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.platform}
            style={{
              color: 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}
