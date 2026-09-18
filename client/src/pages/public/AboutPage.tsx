import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import { mediaUrl } from '../../api';
import { bannerFor } from '../../utils/banners';
import CvDownload from '../../components/portfolio/CvDownload';

export default function AboutPage() {
  usePageTitle('À propos');
  const { data } = usePortfolio();
  if (!data) return null;
  const { profile, page_banners } = data;

  return (
    <>
      <PageBanner
        badge="À propos"
        title={profile.about_title}
        subtitle="Housséni YABRE - Data Engineer - UTT"
        image={bannerFor(page_banners, 'about')}
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
              <li>Stage de fin d’études de 6 mois en Data Engineering (mars 2027)</li>
              <li>Pipelines, ETL/ELT, qualité des données et mise en production</li>
              <li>Python, SQL, Spark, cloud — l’IA comme levier sur des données fiables</li>
              <li>Spécialisation UTT : Data Engineering et Intelligence Artificielle</li>
            </ul>
            {profile.location && <p className="location-pin">📍 {profile.location}</p>}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/parcours" className="btn btn-primary">
                Mon parcours
              </Link>
              <CvDownload profile={profile} className="btn btn-ghost" />
              <Link to="/contact" className="btn btn-ghost">
                Me contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
