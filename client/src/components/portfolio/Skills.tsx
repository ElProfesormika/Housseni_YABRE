import type { Profile, Skill } from '../../types';
import SkillsGrid from './SkillsGrid';

export default function Skills({ profile, skills }: { profile: Profile; skills: Skill[] }) {
  return (
    <section id="skills" className="section" style={{ background: 'var(--bg-elevated)' }}>
      <div className="container">
        <h2 className="section-title">Compétences</h2>
        <p className="section-subtitle">{profile.skills_intro}</p>
        <SkillsGrid skills={skills} />
      </div>
    </section>
  );
}
