import { useParams, Navigate } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import DetailView, { DetailParagraphs } from '../../components/portfolio/DetailView';

export default function EducationDetailPage() {
  const { id } = useParams();
  const { data } = usePortfolio();
  const edu = data?.education.find((e) => e.id === Number(id));
  usePageTitle(edu?.degree || 'Formation');

  if (!data) return null;
  if (!edu) return <Navigate to="/parcours" replace />;

  const body = edu.long_description || edu.description || '';
  const period = `${edu.start_date || ''} — ${edu.end_date || ''}`;

  return (
    <DetailView
      backTo="/parcours"
      backLabel="Retour au parcours"
      breadcrumb={[
        { label: 'Accueil', to: '/' },
        { label: 'Parcours', to: '/parcours' },
        { label: edu.degree },
      ]}
      title={edu.degree}
      subtitle={`${edu.school}${edu.field ? ` — ${edu.field}` : ''}`}
      image={edu.image_url || undefined}
      meta={period}
    >
      <DetailParagraphs text={body} />
    </DetailView>
  );
}
