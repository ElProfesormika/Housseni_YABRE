import { FileDown } from 'lucide-react';
import type { Profile } from '../../types';

export function cvFileName(profile: Pick<Profile, 'first_name' | 'last_name'>) {
  const slug = `${profile.first_name || 'Housseni'}_${profile.last_name || 'YABRE'}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]+/g, '_');
  return `CV_${slug}.pdf`;
}

export default function CvDownload({
  profile,
  className = 'btn btn-ghost',
  label = 'Télécharger le CV',
  compact = false,
}: {
  profile: Profile;
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  if (!profile.cv_url) return null;
  const name = cvFileName(profile);
  const text = compact ? 'CV' : label;
  return (
    <a href="/api/cv" download={name} className={className} aria-label={label}>
      <FileDown size={compact ? 16 : 18} /> {text}
    </a>
  );
}
