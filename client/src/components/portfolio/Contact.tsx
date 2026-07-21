import { Mail, Phone } from 'lucide-react';
import type { Profile } from '../../types';

export default function Contact({ profile }: { profile: Profile }) {
  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-elevated)' }}>
      <div className="container">
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">Discutons de vos projets ou opportunités</p>
        <div className="card" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            N'hésitez pas à me contacter pour un stage, une collaboration ou toute question.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <a href={`mailto:${profile.email}`} className="btn btn-primary" style={{ width: '100%', maxWidth: 320 }}>
              <Mail size={18} /> {profile.email}
            </a>
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="btn btn-ghost" style={{ width: '100%', maxWidth: 320 }}>
                <Phone size={18} /> {profile.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
