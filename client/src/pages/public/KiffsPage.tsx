import { Link, Navigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import { bannerFor } from '../../utils/banners';
import { mediaUrl } from '../../api';
import { kiffsArePublic } from '../../utils/settings';

const CATEGORY_TITLES: Record<string, string> = {
  entreprise: 'Entreprises',
  labo: 'Laboratoires',
  article: 'Articles',
  autre: 'Coups de cœur',
};

const CATEGORY_BADGE: Record<string, string> = {
  entreprise: 'Entreprise',
  labo: 'Laboratoire',
  article: 'Article',
  autre: 'Coup de cœur',
};

export default function KiffsPage() {
  usePageTitle('Mes kiff');
  const { data } = usePortfolio();
  if (!data) return null;
  if (!kiffsArePublic(data.settings)) return <Navigate to="/" replace />;
  const kiffs = data.kiffs ?? [];
  const page_banners = data.page_banners ?? [];

  const byCategory = ['entreprise', 'labo', 'article', 'autre']
    .map((cat) => ({
      cat,
      label: CATEGORY_TITLES[cat] || cat,
      items: kiffs.filter((k) => (k.category || 'autre').toLowerCase() === cat),
    }))
    .filter((g) => g.items.length > 0);

  const ungrouped = kiffs.filter(
    (k) => !['entreprise', 'labo', 'article', 'autre'].includes((k.category || '').toLowerCase())
  );

  return (
    <>
      <PageBanner
        badge="Mes kiff"
        title="Entreprises, labos & lectures coup de cœur"
        subtitle="Ce qui m’inspire côté data, modèles et systèmes à grande échelle"
        image={bannerFor(page_banners, 'kiffs')}
      />
      <section className="section-page container">
        {!kiffs.length && (
          <p style={{ color: 'var(--text-muted)' }}>Aucun coup de cœur pour le moment.</p>
        )}

        {byCategory.map((g) => (
          <div key={g.cat} className="kiff-group">
            <h2 className="block-title">{g.label}</h2>
            <div className="grid-2">
              {g.items.map((k) => (
                <article key={k.id} className="kiff-card card">
                  {k.image_url && (
                    <div className="kiff-card__media">
                      <img src={mediaUrl(k.image_url)} alt="" />
                    </div>
                  )}
                  <div className="kiff-card__body">
                    <span className="kiff-card__cat">{CATEGORY_BADGE[g.cat] || g.cat}</span>
                    <h3>{k.title}</h3>
                    <p>{k.description}</p>
                    {(k.long_description || '').trim() && (
                      <p className="kiff-card__detail">{k.long_description}</p>
                    )}
                    <div className="kiff-card__actions">
                      <Link to={`/mes-kiff/${k.id}`} className="link-accent">
                        Voir le détail →
                      </Link>
                      {k.url && (
                        <a href={k.url} target="_blank" rel="noopener noreferrer" className="link-accent">
                          <ExternalLink size={14} /> Lien
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}

        {ungrouped.length > 0 && (
          <div className="kiff-group">
            <h2 className="block-title">Autres</h2>
            <div className="grid-2">
              {ungrouped.map((k) => (
                <article key={k.id} className="kiff-card card">
                  <div className="kiff-card__body">
                    <span className="kiff-card__cat">{k.category}</span>
                    <h3>{k.title}</h3>
                    <p>{k.description}</p>
                    <Link to={`/mes-kiff/${k.id}`} className="link-accent">
                      Voir le détail →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
