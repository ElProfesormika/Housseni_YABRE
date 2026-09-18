import { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { api, mediaUrl } from '../../api';
import { parseGalleryUrls } from '../../utils/gallery';

export default function MultiImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (json: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const images = parseGalleryUrls(value);

  const setImages = (next: string[]) => onChange(JSON.stringify(next));

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setLoading(true);
    setError('');
    try {
      const urls: string[] = [];
      for (const file of files) {
        const { url } = await api.uploadImage(file);
        urls.push(url);
      }
      setImages([...images, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur upload');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const removeAt = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="multi-upload-grid">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="multi-upload-item">
              <img src={mediaUrl(url)} alt="" />
              <button type="button" className="multi-upload-remove" onClick={() => removeAt(i)} aria-label="Retirer">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="btn btn-ghost" style={{ cursor: 'pointer', display: 'inline-flex' }}>
        <Upload size={16} /> {loading ? 'Upload…' : 'Ajouter des images'}
        <input type="file" accept="image/*" multiple hidden onChange={handleFiles} disabled={loading} />
      </label>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        Plusieurs fichiers possibles depuis l’ordinateur.
      </p>
      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 4 }}>{error}</p>}
    </div>
  );
}
