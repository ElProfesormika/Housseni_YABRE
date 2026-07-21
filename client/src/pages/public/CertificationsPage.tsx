import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import ClickableCard from '../../components/portfolio/ClickableCard';

export default function CertificationsPage() {
  usePageTitle('Certifications');
  const { data } = usePortfolio();
  if (!data) return null;

  return (
    <>
      <PageBanner
        badge="Certifications"
        title="Formations & Certificats"
        subtitle="Compétences validées en cloud, data et machine learning"
        image="/assets/images/AWS.img.jpeg"
      />
      <section className="section-page container">
        <div className="grid-3">
          {data.certifications.map((c) => (
            <ClickableCard
              key={c.id}
              to={`/certifications/${c.id}`}
              title={c.title}
              excerpt={c.issuer || 'Certification professionnelle'}
              image={c.image_url}
              meta={c.date || undefined}
            />
          ))}
        </div>
      </section>
    </>
  );
}
