import { useEffect, useState } from 'react';
import { Save, Key } from 'lucide-react';
import { api } from '../../api';
import PasswordInput from '../../components/admin/PasswordInput';

const HOME_FIELDS: { key: string; label: string; textarea?: boolean; hint?: string }[] = [
  {
    key: 'header_role',
    label: 'Sous-titre du logo (ex. Data Engineer · UTT)',
    hint: 'Texte sous le nom dans le header public',
  },
  {
    key: 'hero_badge',
    label: 'Badge hero (ex. Stage Data Engineer · Data Scientist)',
  },
  {
    key: 'hero_greeting',
    label: 'Salutation hero (ex. Bonjour, je suis)',
    hint: 'Texte avant le nom dans le titre d’accueil',
  },
  {
    key: 'hero_contact_label',
    label: 'Libellé bouton contact hero',
  },
  {
    key: 'home_cta_title',
    label: 'Titre bandeau CTA (ex. Un stage data)',
  },
  {
    key: 'home_cta_text',
    label: 'Texte bandeau CTA (stage Data Engineer)',
    textarea: true,
  },
  {
    key: 'home_cta_button',
    label: 'Bouton bandeau CTA',
  },
  {
    key: 'contact_sought_title',
    label: 'Contact - titre « Profil recherché »',
  },
  {
    key: 'contact_sought_text',
    label: 'Contact - texte Profil recherché',
    textarea: true,
    hint: 'Texte affiché sur la page Contact',
  },
];

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

      <form onSubmit={saveSettings} className="card" style={{ maxWidth: 640, marginBottom: '2rem' }}>
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

        <h2 style={{ fontSize: '1.1rem', margin: '1.75rem 0 1rem' }}>Pages publiques</h2>
        <label className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={(settings.kiffs_public ?? 'true') !== 'false'}
            onChange={(e) =>
              setSettings((s) => ({ ...s, kiffs_public: e.target.checked ? 'true' : 'false' }))
            }
            style={{ marginTop: 4 }}
          />
          <span>
            Afficher la page « Mes kiff » au public
            <br />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Décochez pour la retirer du menu, du pied de page et des URL publiques. L’admin reste accessible.
            </span>
          </span>
        </label>

        <h2 style={{ fontSize: '1.1rem', margin: '1.75rem 0 1rem' }}>Accueil & Contact - textes éditables</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Badge, salutation, bandeau d’accueil, et bloc « Profil recherché » (page Contact).
        </p>
        {HOME_FIELDS.map((f) => (
          <div key={f.key} className="form-group">
            <label>{f.label}</label>
            {f.hint && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{f.hint}</p>
            )}
            {f.textarea ? (
              <textarea
                className="form-textarea"
                rows={3}
                value={settings[f.key] || ''}
                onChange={(e) => setSettings((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            ) : (
              <input
                className="form-input"
                value={settings[f.key] || ''}
                onChange={(e) => setSettings((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            )}
          </div>
        ))}

        <button type="submit" className="btn btn-primary">
          <Save size={18} /> Enregistrer
        </button>
      </form>

      <form onSubmit={changePassword} className="card" style={{ maxWidth: 640 }}>
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
        <button type="submit" className="btn btn-ghost">
          Mettre à jour le mot de passe
        </button>
      </form>
    </div>
  );
}
