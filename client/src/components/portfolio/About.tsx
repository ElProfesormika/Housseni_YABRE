import { mediaUrl } from '../../api';
import type { Profile } from '../../types';

export default function About({ profile }: { profile: Profile }) {
  const img = mediaUrl(profile.about_image_url);
  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">À propos</h2>
        <p className="section-subtitle">Qui je suis et ce qui me motive</p>
        <div style={{ display: 'grid', gap: '2.5rem', alignItems: 'center' }} className="about-grid">
          <div className="card" style={{ aspectRatio: '4/3', overflow: 'hidden', padding: 0 }}>
            {img ? (
              <img src={img} alt="About" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '100%', minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text-muted)' }}>
                Photo à propos
              </div>
            )}
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{profile.about_title}</h3>
            <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: 1.8 }}>{profile.about_text}</p>
            {profile.location && (
              <p style={{ marginTop: '1.5rem', color: 'var(--accent)', fontWeight: 500 }}>📍 {profile.location}</p>
            )}
          </div>
        </div>
      </div>
      <style>{`@media (min-width: 768px) { .about-grid { grid-template-columns: 1fr 1.2fr !important; } }`}</style>
    </section>
  );
}
