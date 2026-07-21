import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="breadcrumb container" aria-label="Fil d'Ariane">
      {items.map((item, i) => (
        <span key={i} className="breadcrumb__item">
          {i > 0 && <ChevronRight size={14} className="breadcrumb__sep" />}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
