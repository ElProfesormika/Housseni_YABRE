import { Link } from 'react-router-dom';
import { Database, Brain, Cloud, ArrowRight, Mail, FileDown } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { mediaUrl } from '../../api';
import { fullName, initials } from '../../utils/profile';
import { usePageTitle } from '../../hooks/usePageTitle';
import SocialIcons from '../../components/portfolio/SocialIcons';

const pillars = [
  { icon: Database, title: 'Data Engineering', desc: 'Pipelines ETL, SQL, Spark, qualité des données', to: '/competences' },
  { icon: Brain, title: 'Intelligence Artificielle', desc: 'ML, Deep Learning, LLM et agents IA', to: '/projets' },
  { icon: Cloud, title: 'Cloud & MLOps', desc: 'AWS, Docker, déploiement scalable', to: '/projets' },
];

export default function HomePage() {
  usePageTitle();
  const { data } = usePortfolio();
  if (!data) return null;
  const { profile, social_links, projects, experiences, skills, certifications } = data;
  const avatar = mediaUrl(profile.avatar_url);
  const name = fullName(profile);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const cvUrl = profile.cv_url ? mediaUrl(profile.cv_url) : '';

  const stats = [
    { value: projects.length, label: 'Projets' },
    { value: skills.length, label: 'Compétences' },
    { value: certifications.length, label: 'Certifications' },
    { value: experiences.length + data.education.length, label: 'Parcours' },
  ];

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__grid">
          <div>
            <span className="home-hero__badge">Data Engineer & Ingénieur IA</span>
            <h1>
              Bonjour, je suis <span className="text-gradient">{name}</span>
              <br />
              {profile.title}
            </h1>
            <p className="home-hero__tagline">{profile.tagline}</p>
            <div className="home-hero__actions">
              <Link to="/projets" className="btn btn-primary">
                Mes projets <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                <Mail size={18} /> Me contacter
              </Link>
              {cvUrl && (
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <FileDown size={18} /> CV
                </a>
              )}
            </div>
            <SocialIcons links={social_links} size={22} />
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

      <section className="section-sm container">
        <div className="pillars">
          {pillars.map(({ icon: Icon, title, desc, to }) => (
            <Link key={to} to={to} className="pillar card">
              <Icon size={28} style={{ color: 'var(--accent)' }} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section-sm container">
          <div className="section-head">
            <h2>Projets phares</h2>
            <Link to="/projets" className="link-accent">
              Tout voir →
            </Link>
          </div>
          <div className="grid-3">
            {featured.map((p) => (
              <Link key={p.id} to={`/projets/${p.id}`} className="mini-card card">
                {p.image_url && <img src={mediaUrl(p.image_url)} alt="" />}
                <h3>{p.title}</h3>
                <p>{p.description.slice(0, 100)}…</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section-sm container">
        <div className="cta-band card">
          <div>
            <h2>Parcours Data & IA</h2>
            <p>{experiences[0]?.description || profile.skills_intro}</p>
          </div>
          <Link to="/parcours" className="btn btn-primary">
            Parcours de {name}
          </Link>
        </div>
      </section>
    </>
  );
}
