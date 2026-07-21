import { Link } from 'react-router-dom';
import ClickableCard from './ClickableCard';
import type { Project } from '../../types';

export default function RelatedProjects({
  current,
  projects,
}: {
  current: Project;
  projects: Project[];
}) {
  const tags = current.tags ? current.tags.split(',').map((t) => t.trim().toLowerCase()) : [];
  const related = projects
    .filter((p) => p.id !== current.id)
    .map((p) => {
      const pTags = p.tags ? p.tags.split(',').map((t) => t.trim().toLowerCase()) : [];
      const score = pTags.filter((t) => tags.includes(t)).length;
      return { p, score };
    })
    .filter(({ score }) => score > 0 || tags.length === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ p }) => p);

  if (!related.length) return null;

  return (
    <section className="related-section container">
      <h2 className="block-title">Projets similaires</h2>
      <div className="grid-3">
        {related.map((p) => (
          <ClickableCard
            key={p.id}
            to={`/projets/${p.id}`}
            title={p.title}
            excerpt={p.description}
            image={p.image_url}
            tags={p.tags ? p.tags.split(',').map((t) => t.trim()) : []}
          />
        ))}
      </div>
      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link to="/projets" className="link-accent">
          Voir tous les projets →
        </Link>
      </p>
    </section>
  );
}
