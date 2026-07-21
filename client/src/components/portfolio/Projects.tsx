import { ExternalLink, Github } from 'lucide-react';
import { mediaUrl } from '../../api';
import type { Project } from '../../types';

export default function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  const list = featured.length ? [...featured, ...others] : projects;

  return (
    <section id="projects" className="section" style={{ background: 'var(--bg-elevated)' }}>
      <div className="container">
        <h2 className="section-title">Projets</h2>
        <p className="section-subtitle">Réalisations en data science, IA et ingénierie</p>
        <div className="grid-2">
          {list.map((p) => (
            <article key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {p.image_url && (
                <div style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9', background: 'var(--bg)' }}>
                  <img src={mediaUrl(p.image_url)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{p.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', flex: 1 }}>{p.description}</p>
              {p.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {p.tags.split(',').map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.6rem',
                        background: 'rgba(6, 182, 212, 0.12)',
                        color: 'var(--accent)',
                        borderRadius: 20,
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {p.project_url && (
                  <a href={p.project_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    <ExternalLink size={16} /> Demo
                  </a>
                )}
                {p.repo_url && (
                  <a href={p.repo_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    <Github size={16} /> Code
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
