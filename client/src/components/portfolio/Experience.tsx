import type { Experience as Exp, Education } from '../../types';
import { Briefcase, GraduationCap } from 'lucide-react';

function formatPeriod(start: string, end: string | null, current: number) {
  const endLabel = current ? 'Présent' : end || '';
  return `${start} — ${endLabel}`;
}

export default function ExperienceSection({
  experiences,
  education,
}: {
  experiences: Exp[];
  education: Education[];
}) {
  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="section-title">Parcours</h2>
        <p className="section-subtitle">Expériences professionnelles et formation</p>

        {experiences.length > 0 && (
          <>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              <Briefcase size={22} /> Expériences
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              {experiences.map((e) => (
                <article key={e.id} className="card" style={{ borderLeft: '3px solid var(--accent)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{e.role}</h4>
                      <p style={{ color: 'var(--accent)' }}>{e.company}</p>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--mono)' }}>
                      {formatPeriod(e.start_date, e.end_date, e.current)}
                    </span>
                  </div>
                  {e.location && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{e.location}</p>}
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{e.description}</p>
                </article>
              ))}
            </div>
          </>
        )}

        {education.length > 0 && (
          <>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-2)' }}>
              <GraduationCap size={22} /> Formation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {education.map((e) => (
                <article key={e.id} className="card" style={{ borderLeft: '3px solid var(--accent-2)' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{e.degree}</h4>
                  <p style={{ color: 'var(--accent-2)' }}>{e.school}{e.field ? ` — ${e.field}` : ''}</p>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--mono)' }}>
                    {e.start_date} — {e.end_date}
                  </span>
                  {e.description && <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>{e.description}</p>}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
