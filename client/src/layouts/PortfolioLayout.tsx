import { Outlet } from 'react-router-dom';
import { PortfolioProvider, usePortfolio } from '../context/PortfolioContext';
import Header from '../components/portfolio/Header';
import Footer from '../components/portfolio/Footer';
import BackToTop from '../components/BackToTop';

function LayoutInner() {
  const { data, loading, error } = usePortfolio();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader-ring" />
        <p>Chargement du portfolio Housséni YABRE…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <p className="alert alert-error">{error || 'Portfolio indisponible'}</p>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          Lancez : <code>npm run db:up</code> puis <code>npm run dev</code>
        </p>
      </div>
    );
  }

  return (
    <>
      <Header profile={data.profile} />
      <main className="site-main page-enter">
        <Outlet />
      </main>
      <Footer profile={data.profile} socials={data.social_links} footerText={data.settings.footer_text || ''} />
      <BackToTop />
    </>
  );
}

export default function PortfolioLayout() {
  return (
    <PortfolioProvider>
      <LayoutInner />
    </PortfolioProvider>
  );
}
