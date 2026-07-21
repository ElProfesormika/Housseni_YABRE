import { useParams, Navigate } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import DetailView, { DetailParagraphs } from '../../components/portfolio/DetailView';
import RelatedProjects from '../../components/portfolio/RelatedProjects';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { data } = usePortfolio();
  const project = data?.projects.find((p) => p.id === Number(id));
  usePageTitle(project?.title || 'Projet');

  if (!data) return null;
  if (!project) return <Navigate to="/projets" replace />;

  const body = project.long_description || project.description;
  const tags = project.tags ? project.tags.split(',').map((t) => t.trim()) : [];

  return (
    <>
      <DetailView
        backTo="/projets"
        backLabel="Retour aux projets"
        breadcrumb={[
          { label: 'Accueil', to: '/' },
          { label: 'Projets', to: '/projets' },
          { label: project.title },
        ]}
        title={project.title}
        subtitle="Projet Data / IA — Housséni YABRE"
        image={project.image_url}
        tags={tags}
        projectUrl={project.project_url || undefined}
        repoUrl={project.repo_url || undefined}
      >
        <DetailParagraphs text={body} />
      </DetailView>
      <RelatedProjects current={project} projects={data.projects} />
    </>
  );
}
