import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import { mediaUrl } from '../../api';

export default function AboutPage() {
  usePageTitle('À propos');
  const { data } = usePortfolio();
  if (!data) return null;
  const { profile } = data;

  return (
    <>
      <PageBanner
        badge="À propos"
        title={profile.about_title}
        subtitle="Housséni YABRE — Data Engineer & Ingénieur IA — UTT"
        image={profile.about_image_url || profile.avatar_url}
      />
      <section className="section-page container">
        <div className="split-content">
          <div className="card split-content__img-wrap">
            <img
              src={mediaUrl(profile.about_image_url || profile.avatar_url)}
              alt="Portrait"
              className="split-content__img"
            />
          </div>
          <div>
            <p className="prose">{profile.about_text}</p>
            <ul className="focus-list">
              <li>Pipelines de données & ETL (Talend, SQL, Spark)</li>
              <li>Modélisation ML / DL & LLM en production</li>
              <li>Architectures cloud AWS & conteneurisation Docker</li>
              <li>Visualisation & storytelling data (Power BI, Python)</li>
            </ul>
            {profile.location && <p className="location-pin">📍 {profile.location}</p>}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/parcours" className="btn btn-primary">Mon parcours</Link>
              <Link to="/contact" className="btn btn-ghost">Me contacter</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
