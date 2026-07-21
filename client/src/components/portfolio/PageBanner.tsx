import { mediaUrl } from '../../api';

export default function PageBanner({
  title,
  subtitle,
  image,
  badge,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
}) {
  const bg = image ? mediaUrl(image) : '';
  return (
    <section
      className="page-banner"
      style={bg ? { backgroundImage: `linear-gradient(135deg, var(--banner-overlay), transparent 70%), url(${bg})` } : undefined}
    >
      <div className="container page-banner__inner">
        {badge && <span className="page-banner__badge">{badge}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
