import { useState } from 'react';
import { FileUp, Trash2 } from 'lucide-react';
import { api, mediaUrl } from '../../api';

export default function FileUpload({
  value,
  onChange,
  accept,
  label = 'Choisir un fichier',
}: {
  value: string;
  onChange: (url: string) => void;
  accept: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const { url } = await api.uploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur upload');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(value) || value.includes('video');
  const isPdf = /\.pdf$/i.test(value);

  return (
    <div>
      {value && (
        <div style={{ marginBottom: '0.75rem' }}>
          {isVideo ? (
            <video src={mediaUrl(value)} controls style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }} />
          ) : isPdf ? (
            <a href={mediaUrl(value)} target="_blank" rel="noopener noreferrer" className="link-accent">
              CV / PDF actuel →
            </a>
          ) : (
            <a href={mediaUrl(value)} target="_blank" rel="noopener noreferrer" className="link-accent">
              Fichier actuel →
            </a>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginLeft: 8, padding: '0.35rem' }}
            onClick={() => onChange('')}
            aria-label="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
      <label className="btn btn-ghost" style={{ cursor: 'pointer', display: 'inline-flex' }}>
        <FileUp size={16} /> {loading ? 'Upload…' : label}
        <input type="file" accept={accept} hidden onChange={handleFile} disabled={loading} />
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
