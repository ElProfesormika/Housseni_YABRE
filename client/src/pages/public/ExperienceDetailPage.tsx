import { useParams, Navigate } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import DetailView, { DetailParagraphs } from '../../components/portfolio/DetailView';

export default function ExperienceDetailPage() {
  const { id } = useParams();
  const { data } = usePortfolio();
  const exp = data?.experiences.find((e) => e.id === Number(id));
  usePageTitle(exp?.role || 'Expérience');

  if (!data) return null;
  if (!exp) return <Navigate to="/parcours" replace />;

  const body = exp.long_description || exp.description;
  const period = `${exp.start_date} — ${exp.current ? 'Présent' : exp.end_date || ''}`;

  return (
    <DetailView
      backTo="/parcours"
      backLabel="Retour au parcours"
      breadcrumb={[
        { label: 'Accueil', to: '/' },
        { label: 'Parcours', to: '/parcours' },
        { label: exp.role },
      ]}
      title={exp.role}
      subtitle={exp.company}
      image={exp.image_url || undefined}
      meta={[exp.location, period].filter(Boolean).join(' · ')}
    >
      <DetailParagraphs text={body} />
    </DetailView>
  );
}
