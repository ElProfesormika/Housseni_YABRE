import { Award, ExternalLink } from 'lucide-react';
import { mediaUrl } from '../../api';
import type { Certification } from '../../types';

export default function Certifications({ items }: { items: Certification[] }) {
  if (!items.length) return null;
  return (
    <section id="certifications" className="section">
      <div className="container">
        <h2 className="section-title">Certifications</h2>
        <p className="section-subtitle">Formations et certifications obtenues</p>
        <div className="grid-3">
          {items.map((c) => (
            <article key={c.id} className="card" style={{ textAlign: 'center' }}>
              {c.image_url ? (
                <img
                  src={mediaUrl(c.image_url)}
                  alt={c.title}
                  style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 1rem', borderRadius: 8 }}
                />
              ) : (
                <Award size={48} style={{ margin: '0 auto 1rem', color: 'var(--accent)' }} />
              )}
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{c.title}</h3>
              {c.issuer && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{c.issuer}</p>}
              {c.date && <p style={{ color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{c.date}</p>}
              {c.credential_url && (
                <a href={c.credential_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', marginTop: '0.75rem', color: 'var(--accent)', gap: 4, alignItems: 'center', fontSize: '0.85rem' }}>
                  Voir <ExternalLink size={14} />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
