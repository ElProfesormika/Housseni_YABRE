import type { Profile } from '../types';

export function fullName(profile: Pick<Profile, 'first_name' | 'last_name'>): string {
  return `${profile.first_name} ${profile.last_name}`.trim();
}

export function initials(profile: Pick<Profile, 'first_name' | 'last_name'>): string {
  return `${profile.first_name[0] || ''}${profile.last_name[0] || ''}`.toUpperCase();
}
