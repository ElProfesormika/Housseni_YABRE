import { useState } from 'react';
import { Send } from 'lucide-react';
import { api } from '../../api';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await api.sendContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur envoi');
    }
  };

  return (
    <form className="contact-form card" onSubmit={submit}>
      <h2>Envoyer un message</h2>
      {status === 'success' && (
        <div className="alert alert-success">Message envoyé — Housséni YABRE vous répondra rapidement.</div>
      )}
      {status === 'error' && error && <div className="alert alert-error">{error}</div>}
      <div className="form-group">
        <label>Nom complet</label>
        <input
          className="form-input"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          placeholder="Votre nom"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          className="form-input"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
          placeholder="votre.email@domaine.com"
        />
      </div>
      <div className="form-group">
        <label>Objet</label>
        <input
          className="form-input"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          placeholder="Stage, collaboration…"
        />
      </div>
      <div className="form-group">
        <label>Message</label>
        <textarea
          className="form-textarea"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
          rows={5}
          placeholder="Votre message…"
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
        <Send size={18} /> {status === 'loading' ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  );
}
