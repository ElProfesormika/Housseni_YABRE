import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page introuvable');

  return (
    <section className="not-found container">
      <p className="not-found__code">404</p>
      <h1>Page introuvable</h1>
      <p>Cette page n'existe pas dans le portfolio de Housséni YABRE.</p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Accueil
        </Link>
        <Link to="/projets" className="btn btn-ghost">
          <Search size={18} /> Voir les projets
        </Link>
      </div>
    </section>
  );
}
