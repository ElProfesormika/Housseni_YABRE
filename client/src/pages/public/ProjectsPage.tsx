import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import ClickableCard from '../../components/portfolio/ClickableCard';

export default function ProjectsPage() {
  usePageTitle('Projets');
  const { data } = usePortfolio();
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const projects = data?.projects ?? [];

  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      p.tags?.split(',').forEach((t) => {
        const tag = t.trim();
        if (tag) set.add(tag);
      });
    });
    return [...set].sort();
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return projects.filter((p) => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.toLowerCase().includes(q);
      const matchTag =
        !tagFilter ||
        p.tags?.split(',').map((t) => t.trim()).includes(tagFilter);
      return matchSearch && matchTag;
    });
  }, [projects, search, tagFilter]);

  const featured = filtered.filter((p) => p.featured);
  const others = filtered.filter((p) => !p.featured);

  if (!data) return null;

  return (
    <>
      <PageBanner
        badge="Projets"
        title="Réalisations Data & IA"
        subtitle="Housséni YABRE — pipelines, ML, cloud, LLM et analyse de données"
        image="/assets/images/ML.jpeg"
      />
      <section className="section-page container">
        <div className="filters-bar">
          <div className="search-input-wrap">
            <Search size={18} />
            <input
              className="form-input"
              placeholder="Rechercher un projet…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="tag-filters">
            <button
              type="button"
              className={`tag-filter${!tagFilter ? ' is-active' : ''}`}
              onClick={() => setTagFilter(null)}
            >
              Tous
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-filter${tagFilter === tag ? ' is-active' : ''}`}
                onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            Aucun projet ne correspond à votre recherche.
          </p>
        )}

        {featured.length > 0 && (
          <>
            <h2 className="block-title">Projets mis en avant</h2>
            <div className="grid-2" style={{ marginBottom: '3rem' }}>
              {featured.map((p) => (
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
          </>
        )}
        {others.length > 0 && (
          <>
            {featured.length > 0 && <h2 className="block-title">Autres projets</h2>}
            <div className="grid-2">
              {others.map((p) => (
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
          </>
        )}
      </section>
    </>
  );
}
