import { useState } from 'react';
import { Upload } from 'lucide-react';
import { api, mediaUrl } from '../../api';

export default function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const { url } = await api.uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {value && (
        <img
          src={mediaUrl(value)}
          alt="Preview"
          style={{ maxHeight: 120, borderRadius: 8, marginBottom: '0.75rem', objectFit: 'cover' }}
        />
      )}
      <label className="btn btn-ghost" style={{ cursor: 'pointer', display: 'inline-flex' }}>
        <Upload size={16} /> {loading ? 'Upload…' : 'Choisir une image'}
        <input type="file" accept="image/*" hidden onChange={handleFile} disabled={loading} />
      </label>
      <input
        className="form-input"
        style={{ marginTop: '0.75rem' }}
        placeholder="Ou coller une URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: 4 }}>{error}</p>}
    </div>
  );
}
