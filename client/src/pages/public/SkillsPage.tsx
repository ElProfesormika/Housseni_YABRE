import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import SkillsGrid from '../../components/portfolio/SkillsGrid';
import { bannerFor } from '../../utils/banners';

export default function SkillsPage() {
  usePageTitle('Compétences');
  const { data } = usePortfolio();
  if (!data) return null;
  const { profile, skills, skill_sections, page_banners } = data;
  const sections = skill_sections || [];
  const cards = skills || [];

  const grouped = sections
    .map((sec) => ({
      ...sec,
      skills: cards.filter((s) => Number(s.section_id) === sec.id).sort((a, b) => a.sort_order - b.sort_order),
    }))
    .filter((g) => g.skills.length > 0);

  const ungrouped = cards.filter((s) => !s.section_id);

  return (
    <>
      <PageBanner
        badge="Compétences"
        title="Outils & méthodes data"
        subtitle={profile.skills_intro}
        image={bannerFor(page_banners, 'skills')}
      />
      <section className="section-page container">
        {grouped.map((g) => (
          <div key={g.id} className="skill-group">
            <h2 className="skill-group__title">{g.title}</h2>
            <SkillsGrid skills={g.skills} />
          </div>
        ))}
        {ungrouped.length > 0 && (
          <div className="skill-group">
            <h2 className="skill-group__title">Autres</h2>
            <SkillsGrid skills={ungrouped} />
          </div>
        )}
        {!grouped.length && !ungrouped.length && (
          <p style={{ color: 'var(--text-muted)' }}>
            Aucune compétence pour le moment. Ajoutez des groupes puis des cartes depuis l’admin.
          </p>
        )}
      </section>
    </>
  );
}
