import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mediaUrl } from '../../api';

export default function ClickableCard({
  to,
  title,
  excerpt,
  image,
  meta,
  tags,
}: {
  to: string;
  title: string;
  excerpt: string;
  image?: string;
  meta?: string;
  tags?: string[];
}) {
  const img = image ? mediaUrl(image) : '';
  return (
    <Link to={to} className="clickable-card card">
      {img && (
        <div className="clickable-card__img">
          <img src={img} alt="" loading="lazy" />
        </div>
      )}
      <div className="clickable-card__body">
        {meta && <span className="clickable-card__meta">{meta}</span>}
        <h3>{title}</h3>
        <p>{excerpt}</p>
        {tags && tags.length > 0 && (
          <div className="tag-list">
            {tags.slice(0, 4).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
        <span className="clickable-card__cta">
          Voir le détail <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
