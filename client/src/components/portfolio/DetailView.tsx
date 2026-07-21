import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { mediaUrl } from '../../api';
import Breadcrumb from './Breadcrumb';

export default function DetailView({
  backTo,
  backLabel,
  breadcrumb,
  title,
  subtitle,
  image,
  meta,
  tags,
  children,
  projectUrl,
  repoUrl,
  credentialUrl,
}: {
  backTo: string;
  backLabel: string;
  breadcrumb: { label: string; to?: string }[];
  title: string;
  subtitle?: string;
  image?: string;
  meta?: string;
  tags?: string[];
  children: React.ReactNode;
  projectUrl?: string;
  repoUrl?: string;
  credentialUrl?: string;
}) {
  const img = image ? mediaUrl(image) : '';
  return (
    <article className="detail-page">
      <Breadcrumb items={breadcrumb} />
      <div className="container detail-page__grid">
        <div className="detail-page__content">
          <Link to={backTo} className="detail-back">
            <ArrowLeft size={18} /> {backLabel}
          </Link>
          {meta && <p className="detail-meta">{meta}</p>}
          <h1>{title}</h1>
          {subtitle && <p className="detail-subtitle">{subtitle}</p>}
          {tags && tags.length > 0 && (
            <div className="tag-list" style={{ marginBottom: '1.5rem' }}>
              {tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}
          <div className="detail-body">{children}</div>
          <div className="detail-actions">
            {projectUrl && (
              <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <ExternalLink size={18} /> Voir le projet
              </a>
            )}
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <Github size={18} /> Code source
              </a>
            )}
            {credentialUrl && (
              <a href={credentialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <ExternalLink size={18} /> Certificat
              </a>
            )}
          </div>
        </div>
        {img && (
          <aside className="detail-page__aside">
            <img src={img} alt={title} className="detail-hero-img" />
          </aside>
        )}
      </div>
    </article>
  );
}

export function DetailParagraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i}>{p.trim()}</p>
      ))}
    </>
  );
}
