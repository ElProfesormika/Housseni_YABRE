import { Mail, Phone, MapPin } from 'lucide-react';
import CvDownload from '../../components/portfolio/CvDownload';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import SocialIcons from '../../components/portfolio/SocialIcons';
import ContactForm from '../../components/portfolio/ContactForm';
import { bannerFor } from '../../utils/banners';
import { fullName } from '../../utils/profile';

const DEFAULT_SOUGHT =
  'Housséni YABRE recherche un stage de fin d’études de 6 mois (à partir de mars 2027) en Data Engineering : pipelines, qualité des données, plateforme data et mise en production.';

export default function ContactPage() {
  usePageTitle('Contact');
  const { data } = usePortfolio();
  if (!data) return null;
  const { profile, social_links, page_banners, settings } = data;
  const soughtTitle = settings.contact_sought_title || 'Profil recherché';
  const soughtText = settings.contact_sought_text || DEFAULT_SOUGHT;

  return (
    <>
      <PageBanner
        badge="Contact"
        title="Échangeons sur un stage Data Engineer"
        subtitle="Contacter Housséni YABRE — stage de fin d’études en Data Engineering"
        image={bannerFor(page_banners, 'contact')}
      />
      <section className="section-page container">
        <div className="contact-grid contact-grid--wide">
          <ContactForm />
          <div>
            <div className="card contact-card" style={{ marginBottom: '1.5rem' }}>
              <h2>{fullName(profile)}</h2>
              <p className="contact-card__role">{profile.title}</p>
              <a href={`mailto:${profile.email}`} className="contact-line">
                <Mail size={20} /> {profile.email}
              </a>
              {profile.phone && (
                <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="contact-line">
                  <Phone size={20} /> {profile.phone}
                </a>
              )}
              {profile.location && (
                <p className="contact-line">
                  <MapPin size={20} /> {profile.location}
                </p>
              )}
              <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <CvDownload profile={profile} className="btn btn-primary" />
                <SocialIcons links={social_links} size={24} />
              </div>
            </div>
            <div className="card">
              <h2>{soughtTitle}</h2>
              <p className="prose" style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}>
                {soughtText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
