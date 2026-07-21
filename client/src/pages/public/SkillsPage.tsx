import { usePortfolio } from '../../context/PortfolioContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import PageBanner from '../../components/portfolio/PageBanner';
import { mediaUrl } from '../../api';

const groups = [
  { label: 'Data Engineering', keys: ['sql', 'spark', 'etl', 'talend', 'hadoop', 'nosql'] },
  { label: 'IA & ML', keys: ['machine', 'learning', 'deep', 'llm', 'scikit', 'python'] },
  { label: 'Cloud & DevOps', keys: ['aws', 'docker', 'git', 'github'] },
  { label: 'Viz & Web', keys: ['power bi', 'html', 'php', 'chart'] },
];

function matchGroup(name: string, keys: string[]) {
  const n = name.toLowerCase();
  return keys.some((k) => n.includes(k));
}

export default function SkillsPage() {
  usePageTitle('Compétences');
  const { data } = usePortfolio();
  if (!data) return null;
  const { profile, skills } = data;

  return (
    <>
      <PageBanner
        badge="Compétences"
        title="Stack Data Engineer & IA"
        subtitle={profile.skills_intro}
        image={profile.skills_image_url}
      />
      <section className="section-page container">
        <div className="skills-showcase">
          <div className="skills-showcase__img card">
            <img src={mediaUrl(profile.skills_image_url)} alt="Data Science" />
          </div>
          <div>
            {groups.map((g) => {
              const items = skills.filter((s) => matchGroup(s.name, g.keys));
              if (!items.length) return null;
              return (
                <div key={g.label} className="skill-group">
                  <h3>{g.label}</h3>
                  {items.map((s) => (
                    <div key={s.id} className="skill-row">
                      <span>{s.name}</span>
                      <div className="skill-bar">
                        <div style={{ width: `${s.percentage}%` }} />
                      </div>
                      <span className="skill-pct">{s.percentage}%</span>
                    </div>
                  ))}
                </div>
              );
            })}
            {skills.filter((s) => !groups.some((g) => matchGroup(s.name, g.keys))).map((s) => (
              <div key={s.id} className="skill-row">
                <span>{s.name}</span>
                <div className="skill-bar"><div style={{ width: `${s.percentage}%` }} /></div>
                <span className="skill-pct">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
