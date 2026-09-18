import { useEffect, useState } from 'react';
import { Save, ImageIcon } from 'lucide-react';
import { api } from '../../api';
import type { PageBanner } from '../../types';
import ImageUpload from '../../components/admin/ImageUpload';
import { mediaUrl } from '../../api';

export default function AdminBanners() {
  const [banners, setBanners] = useState<PageBanner[]>([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  const load = () => {
    api
      .getPageBanners()
      .then(setBanners)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const setImage = (pageKey: string, image_url: string) => {
    setBanners((list) => list.map((b) => (b.page_key === pageKey ? { ...b, image_url } : b)));
  };

  const saveOne = async (pageKey: string) => {
    const banner = banners.find((b) => b.page_key === pageKey);
    if (!banner) return;
    setSaving(pageKey);
    setError('');
    setMsg('');
    try {
      const updated = await api.updatePageBanner(pageKey, banner.image_url || '');
      setBanners((list) => list.map((b) => (b.page_key === pageKey ? updated : b)));
      setMsg(`Bannière « ${banner.label} » enregistrée.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Bannières des pages</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 640 }}>
        Images de fond (slides) des pages publiques - <strong>indépendantes</strong> de la photo de
        profil et des images de contenu (À propos, compétences, projets…).
      </p>
      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="banners-admin-grid">
        {banners.map((b) => (
          <div key={b.page_key} className="card banners-admin-card">
            <div className="banners-admin-card__preview">
              {b.image_url ? (
                <img src={mediaUrl(b.image_url)} alt="" />
              ) : (
                <span>
                  <ImageIcon size={28} /> Aucune image
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{b.label}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Clé : <code>{b.page_key}</code>
            </p>
            <div className="form-group">
              <label>Image bannière</label>
              <ImageUpload value={b.image_url} onChange={(v) => setImage(b.page_key, v)} />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={saving === b.page_key}
              onClick={() => saveOne(b.page_key)}
            >
              <Save size={16} /> {saving === b.page_key ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
