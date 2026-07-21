import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import ClickableCard from '../../components/portfolio/ClickableCard';

function formatPeriod(start: string, end: string | null, current: number) {
  return `${start} — ${current ? 'Présent' : end || ''}`;
}

export default function ParcoursPage() {
  usePageTitle('Parcours');
  const { data } = usePortfolio();
  if (!data) return null;
  const { experiences, education } = data;

  return (
    <>
      <PageBanner
        badge="Parcours"
        title="Expériences & Formation"
        subtitle="Parcours orienté Data Engineering et Intelligence Artificielle"
        image="/assets/images/DATA_SCIENCE_IMG.webp"
      />
      <section className="section-page container">
        <h2 className="block-title">Expériences professionnelles</h2>
        <div className="grid-2" style={{ marginBottom: '3rem' }}>
          {experiences.map((e) => (
            <ClickableCard
              key={e.id}
              to={`/parcours/experience/${e.id}`}
              title={e.role}
              excerpt={e.description}
              image={e.image_url || undefined}
              meta={`${e.company} · ${formatPeriod(e.start_date, e.end_date, e.current)}`}
            />
          ))}
          {!experiences.length && <p style={{ color: 'var(--text-muted)' }}>Aucune expérience pour le moment.</p>}
        </div>

        <h2 className="block-title">Formation</h2>
        <div className="grid-2">
          {education.map((e) => (
            <ClickableCard
              key={e.id}
              to={`/parcours/formation/${e.id}`}
              title={e.degree}
              excerpt={e.description || `${e.school} — ${e.field || ''}`}
              image={e.image_url || undefined}
              meta={`${e.school} · ${e.start_date} — ${e.end_date}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
