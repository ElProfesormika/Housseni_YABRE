import type { Skill } from '../../types';
import SkillIcon from './SkillIcon';

export default function SkillsGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="skills-grid-cards">
      {skills.map((s) => (
        <article key={s.id} className="skill-card">
          <div className="skill-card__top">
            <SkillIcon icon={s.icon} iconUrl={s.icon_url} name={s.name} />
            <span className="skill-card__pct" aria-label={`Maîtrise ${s.percentage} %`}>
              {s.percentage}%
            </span>
          </div>
          <h3 className="skill-card__name">{s.name}</h3>
          {s.description?.trim() ? <p className="skill-card__desc">{s.description.trim()}</p> : null}
          <div className="skill-card__meter" aria-hidden>
            <div style={{ width: `${Math.min(100, Math.max(0, s.percentage))}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}
