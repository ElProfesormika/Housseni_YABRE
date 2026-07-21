import type { Profile, Skill } from '../../types';
import { mediaUrl } from '../../api';

export default function Skills({ profile, skills }: { profile: Profile; skills: Skill[] }) {
  const img = mediaUrl(profile.skills_image_url);
  return (
    <section id="skills" className="section" style={{ background: 'var(--bg-elevated)' }}>
      <div className="container">
        <h2 className="section-title">Compétences</h2>
        <p className="section-subtitle">{profile.skills_intro}</p>
        <div style={{ display: 'grid', gap: '2.5rem' }} className="skills-grid">
          <div>
            {skills.map((s) => (
              <div key={s.id} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>{s.percentage}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${s.percentage}%`,
                      background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                      borderRadius: 4,
                      transition: 'width 1s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {img && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={img} alt="Skills" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 280 }} />
            </div>
          )}
        </div>
      </div>
      <style>{`@media (min-width: 768px) { .skills-grid { grid-template-columns: 1.2fr 1fr !important; } }`}</style>
    </section>
  );
}
