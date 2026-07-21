import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../api';
import type { Profile } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';

const empty: Profile = {
  id: 1,
  first_name: '',
  last_name: '',
  title: '',
  tagline: '',
  about_title: '',
  about_text: '',
  skills_intro: '',
  email: '',
  phone: '',
  location: '',
  avatar_url: '',
  about_image_url: '',
  skills_image_url: '',
  cv_url: '',
};

export default function AdminProfile() {
  const [form, setForm] = useState<Profile>(empty);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getProfile().then(setForm).catch((e) => setError(e.message));
  }, []);

  const set = (key: keyof Profile, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const updated = await api.updateProfile(form);
      setForm(updated);
      setMsg('Profil enregistré avec succès.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Profil</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Modifiez votre identité, description et coordonnées.</p>
      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={save} className="card" style={{ maxWidth: 720 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Prénom</label>
            <input className="form-input" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} required placeholder="Housséni" />
          </div>
          <div className="form-group">
            <label>Nom de famille</label>
            <input className="form-input" value={form.last_name} onChange={(e) => set('last_name', e.target.value)} required placeholder="YABRE" />
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Affiché sur le site : <strong>{form.first_name} {form.last_name}</strong>
        </p>
        <div className="form-group">
          <label>Titre (sous le nom)</label>
          <input className="form-input" value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Accroche (hero)</label>
          <input className="form-input" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Titre section À propos</label>
          <input className="form-input" value={form.about_title} onChange={(e) => set('about_title', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Description À propos</label>
          <textarea className="form-textarea" value={form.about_text} onChange={(e) => set('about_text', e.target.value)} rows={6} />
        </div>
        <div className="form-group">
          <label>Intro compétences</label>
          <textarea className="form-textarea" value={form.skills_intro} onChange={(e) => set('skills_intro', e.target.value)} rows={3} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input className="form-input" value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Localisation</label>
          <input className="form-input" value={form.location || ''} onChange={(e) => set('location', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Photo profil (hero)</label>
          <ImageUpload value={form.avatar_url} onChange={(v) => set('avatar_url', v)} />
        </div>
        <div className="form-group">
          <label>Image À propos</label>
          <ImageUpload value={form.about_image_url} onChange={(v) => set('about_image_url', v)} />
        </div>
        <div className="form-group">
          <label>Image Compétences</label>
          <ImageUpload value={form.skills_image_url} onChange={(v) => set('skills_image_url', v)} />
        </div>
        <div className="form-group">
          <label>Lien CV (PDF)</label>
          <input className="form-input" value={form.cv_url} onChange={(e) => set('cv_url', e.target.value)} placeholder="https://..." />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Save size={18} /> {loading ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
