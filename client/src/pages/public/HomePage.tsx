import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { mediaUrl } from '../../api';
import { fullName, initials } from '../../utils/profile';
import { usePageTitle } from '../../hooks/usePageTitle';
import SocialIcons from '../../components/portfolio/SocialIcons';
import CvDownload from '../../components/portfolio/CvDownload';

function tagFlow(tags: string) {
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function PipeDiagram() {
  return (
    <div className="pipe-diagram" aria-hidden="true">
      <svg viewBox="0 0 640 120" xmlns="http://www.w3.org/2000/svg">
        <line x1="60" y1="60" x2="220" y2="60" className="pipe-line" />
        <line x1="60" y1="60" x2="220" y2="60" className="pipe-flow" />
        <line x1="260" y1="60" x2="420" y2="60" className="pipe-line" />
        <line x1="260" y1="60" x2="420" y2="60" className="pipe-flow" style={{ animationDelay: '-1s' }} />
        <line x1="460" y1="60" x2="580" y2="60" className="pipe-line" />
        <line x1="460" y1="60" x2="580" y2="60" className="pipe-flow" style={{ animationDelay: '-2s' }} />
        <rect x="10" y="35" width="100" height="50" rx="6" className="pipe-node active" />
        <text x="60" y="65" textAnchor="middle" className="pipe-node-label">
          events
        </text>
        <rect x="220" y="35" width="100" height="50" rx="6" className="pipe-node" />
        <text x="270" y="60" textAnchor="middle" className="pipe-node-label">
          spark
        </text>
        <text x="270" y="73" textAnchor="middle" className="pipe-node-label">
          + sql
        </text>
        <rect x="420" y="35" width="100" height="50" rx="6" className="pipe-node" />
        <text x="470" y="65" textAnchor="middle" className="pipe-node-label">
          warehouse
        </text>
        <rect x="580" y="35" width="50" height="50" rx="6" className="pipe-node" />
        <text x="605" y="65" textAnchor="middle" className="pipe-node-label">
          BI
        </text>
      </svg>
    </div>
  );
}

export default function HomePage() {
  usePageTitle();
  const { data } = usePortfolio();
  if (!data) return null;
  const { profile, social_links, projects, experiences, skills, certifications, settings } = data;
  const avatar = mediaUrl(profile.avatar_url);
  const name = fullName(profile);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  const heroBadge = settings.hero_badge || 'Stage Data Engineer';
  const heroContactLabel = settings.hero_contact_label || 'Proposer un stage';
  const ctaTitle = settings.home_cta_title || 'Un stage Data Engineer';
  const ctaText =
    settings.home_cta_text ||
    'Stage de fin d’études de 6 mois (mars 2027) : pipelines, qualité des données et mise en production.';
  const ctaButton = settings.home_cta_button || 'Me contacter pour un stage';

  const stats = [
    { value: `${projects.length}+`, label: 'pipelines & projets data' },
    { value: skills.length, label: 'outils en stack' },
    { value: certifications.length, label: 'certifications' },
    { value: experiences.length + data.education.length, label: 'étapes de parcours' },
  ];

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__grid">
          <div>
            <span className="home-hero__badge">{heroBadge}</span>
            <p className="home-hero__role">
              {name} — {profile.title}
            </p>
            <h1>Je transforme des données brutes en systèmes fiables.</h1>
            <p className="home-hero__tagline">{profile.tagline}</p>
            <div className="home-hero__actions">
              <Link to="/projets" className="btn btn-primary">
                Voir mes projets <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                <Mail size={18} /> {heroContactLabel}
              </Link>
              <CvDownload profile={profile} className="btn btn-ghost" />
            </div>
            <SocialIcons links={social_links} size={22} />
            <PipeDiagram />
          </div>
          <div className="home-hero__visual">
            <div className="home-hero__ring">
              {avatar ? <img src={avatar} alt={name} /> : <span>{initials(profile)}</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="container stats-bar__grid">
          {stats.map((s) => (
            <div key={s.label} className="stats-bar__item">
              <span className="stats-bar__value">{s.value}</span>
              <span className="stats-bar__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section-sm container">
          <div className="section-head">
            <h2>Projets</h2>
            <Link to="/projets" className="link-accent">
              → tout voir
            </Link>
          </div>
          <div className="grid-2">
            {featured.map((p) => {
              const tags = tagFlow(p.tags || '');
              return (
                <Link key={p.id} to={`/projets/${p.id}`} className="card project-teaser">
                  {p.image_url && <img src={mediaUrl(p.image_url)} alt="" />}
                  <h3>{p.title}</h3>
                  {tags.length > 0 && (
                    <div className="flow-row">
                      {tags.map((t, i) => (
                        <span key={t}>
                          {i > 0 && <span className="flow-arrow"> → </span>}
                          <span className="flow-chip">{t}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  <p>{p.description}</p>
                  <span className="link-accent">→ voir le projet</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="section-sm container">
        <div className="cta-band card">
          <div>
            <h2>{ctaTitle}</h2>
            <p>{ctaText}</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            {ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
