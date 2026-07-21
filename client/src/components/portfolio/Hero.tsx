import { ArrowDown, Mail } from 'lucide-react';
import { mediaUrl } from '../../api';
import type { Profile, SocialLink } from '../../types';
import SocialIcons from './SocialIcons';

export default function Hero({ profile, socials }: { profile: Profile; socials: SocialLink[] }) {
  const avatar = mediaUrl(profile.avatar_url);

  return (
    <section id="home" className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '6rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Housséni YABRE
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>
            {profile.tagline.split(',').map((part, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {part.includes(profile.first_name) ? (
                  <>
                    {part.split(profile.first_name)[0]}
                    <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {profile.first_name}
                    </span>
                    {part.split(profile.first_name)[1]}
                  </>
                ) : (
                  part
                )}
              </span>
            ))}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '520px' }}>{profile.title}</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#contact" className="btn btn-primary">
              <Mail size={18} /> Me contacter
            </a>
            <a href="#projects" className="btn btn-ghost">
              Voir mes projets <ArrowDown size={18} />
            </a>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <SocialIcons links={socials} size={22} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 'min(320px, 80vw)',
              aspectRatio: '1',
              borderRadius: '50%',
              background: `linear-gradient(135deg, var(--accent-glow), rgba(139, 92, 246, 0.2))`,
              padding: '4px',
              boxShadow: '0 0 60px var(--accent-glow)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                fontWeight: 800,
                color: 'var(--accent)',
              }}
            >
              {avatar ? (
                <img src={avatar} alt={profile.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                profile.first_name[0]
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (min-width: 900px) { #home .container { grid-template-columns: 1.2fr 1fr !important; } }`}</style>
    </section>
  );
}
