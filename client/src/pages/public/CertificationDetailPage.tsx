import { useParams, Navigate } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import DetailView, { DetailParagraphs } from '../../components/portfolio/DetailView';

export default function CertificationDetailPage() {
  const { id } = useParams();
  const { data } = usePortfolio();
  const cert = data?.certifications.find((c) => c.id === Number(id));
  usePageTitle(cert?.title || 'Certification');

  if (!data) return null;
  if (!cert) return <Navigate to="/certifications" replace />;

  const body =
    cert.long_description ||
    `${cert.title} — certification obtenue par Housséni YABRE (${cert.issuer || 'formation'}). Renforce le profil Data Engineer & IA : compétences opérationnelles sur l'écosystème data et cloud.`;

  return (
    <DetailView
      backTo="/certifications"
      backLabel="Retour aux certifications"
      breadcrumb={[
        { label: 'Accueil', to: '/' },
        { label: 'Certifications', to: '/certifications' },
        { label: cert.title },
      ]}
      title={cert.title}
      subtitle={cert.issuer || undefined}
      image={cert.image_url}
      meta={cert.date || undefined}
      credentialUrl={cert.credential_url || undefined}
    >
      <DetailParagraphs text={body} />
    </DetailView>
  );
}
