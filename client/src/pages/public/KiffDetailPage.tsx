import { useParams, Navigate, Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import DetailView, { DetailParagraphs } from '../../components/portfolio/DetailView';
import { kiffsArePublic } from '../../utils/settings';

const CATEGORY_LABELS: Record<string, string> = {
  entreprise: 'Entreprise',
  labo: 'Laboratoire',
  article: 'Article',
  autre: 'Coup de cœur',
};

export default function KiffDetailPage() {
  const { id } = useParams();
  const { data } = usePortfolio();
  const kiff = data?.kiffs?.find((k) => k.id === Number(id));
  usePageTitle(kiff?.title || 'Mes kiff');

  if (!data) return null;
  if (!kiffsArePublic(data.settings) || !kiff) return <Navigate to="/" replace />;

  const cat = CATEGORY_LABELS[(kiff.category || '').toLowerCase()] || kiff.category;
  const body = kiff.long_description || kiff.description || '';

  return (
    <DetailView
      backTo="/mes-kiff"
      backLabel="Retour aux kiff"
      breadcrumb={[
        { label: 'Accueil', to: '/' },
        { label: 'Mes kiff', to: '/mes-kiff' },
        { label: kiff.title },
      ]}
      title={kiff.title}
      subtitle={cat}
      image={kiff.image_url || undefined}
      meta={kiff.description}
    >
      <DetailParagraphs text={body} />
      {kiff.url && (
        <p style={{ marginTop: '1.5rem' }}>
          <a href={kiff.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <ExternalLink size={16} /> Ouvrir le lien
          </a>
        </p>
      )}
      <p style={{ marginTop: '1rem' }}>
        <Link to="/mes-kiff" className="link-accent">
          ← Tous les coups de cœur
        </Link>
      </p>
    </DetailView>
  );
}
