import { Mail, Phone, MapPin } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import SocialIcons from '../../components/portfolio/SocialIcons';
import ContactForm from '../../components/portfolio/ContactForm';

export default function ContactPage() {
  usePageTitle('Contact');
  const { data } = usePortfolio();
  if (!data) return null;
  const { profile, social_links } = data;

  return (
    <>
      <PageBanner
        badge="Contact"
        title="Travaillons ensemble"
        subtitle="Contacter Housséni YABRE — stage, alternance ou projet data / IA"
        image={profile.avatar_url}
      />
      <section className="section-page container">
        <div className="contact-grid contact-grid--wide">
          <ContactForm />
          <div>
            <div className="card contact-card" style={{ marginBottom: '1.5rem' }}>
              <h2>Coordonnées</h2>
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
              <div style={{ marginTop: '1.5rem' }}>
                <SocialIcons links={social_links} size={24} />
              </div>
            </div>
            <div className="card">
              <h2>Profil recherché</h2>
              <p className="prose" style={{ marginTop: '1rem' }}>
                Housséni YABRE est disponible pour un <strong>stage de 6 mois</strong> en{' '}
                <strong>Data Engineering</strong>, <strong>MLOps</strong> ou <strong>Ingénierie IA</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
