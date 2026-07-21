import { useEffect, useState } from 'react';
import { Save, Key } from 'lucide-react';
import { api } from '../../api';
import PasswordInput from '../../components/admin/PasswordInput';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    api.getSettings().then(setSettings).catch((e) => setError(e.message));
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setMsg('Paramètres enregistrés.');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await api.changePassword(pwd.current, pwd.next);
      setMsg('Mot de passe modifié.');
      setPwd({ current: '', next: '', confirm: '' });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Paramètres</h1>
      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={saveSettings} className="card" style={{ maxWidth: 560, marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Site</h2>
        <div className="form-group">
          <label>Nom du site (titre navigateur)</label>
          <input
            className="form-input"
            value={settings.site_name || ''}
            onChange={(e) => setSettings((s) => ({ ...s, site_name: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label>Texte pied de page</label>
          <input
            className="form-input"
            value={settings.footer_text || ''}
            onChange={(e) => setSettings((s) => ({ ...s, footer_text: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label>Couleur accent (hex)</label>
          <input
            className="form-input"
            type="color"
            value={settings.theme_accent || '#06b6d4'}
            onChange={(e) => setSettings((s) => ({ ...s, theme_accent: e.target.value }))}
            style={{ height: 48, padding: 4 }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <Save size={18} /> Enregistrer
        </button>
      </form>

      <form onSubmit={changePassword} className="card" style={{ maxWidth: 560 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Key size={20} /> Changer le mot de passe admin
        </h2>
        <div className="form-group">
          <label>Mot de passe actuel</label>
          <PasswordInput
            value={pwd.current}
            onChange={(current) => setPwd((p) => ({ ...p, current }))}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="form-group">
          <label>Nouveau mot de passe</label>
          <PasswordInput
            value={pwd.next}
            onChange={(next) => setPwd((p) => ({ ...p, next }))}
            autoComplete="new-password"
            required
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label>Confirmer</label>
          <PasswordInput
            value={pwd.confirm}
            onChange={(confirm) => setPwd((p) => ({ ...p, confirm }))}
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" className="btn btn-ghost">Mettre à jour le mot de passe</button>
      </form>
    </div>
  );
}
