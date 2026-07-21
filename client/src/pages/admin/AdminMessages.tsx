import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { api } from '../../api';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read_status: number;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Message | null>(null);

  const load = () =>
    api
      .getMessages()
      .then(setMessages)
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: number) => {
    await api.markMessageRead(id);
    load();
    if (selected?.id === id) setSelected((s) => (s ? { ...s, read_status: 1 } : null));
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;
    await api.deleteMessage(id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const unread = messages.filter((m) => !m.read_status).length;

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Messages contact</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {unread > 0 ? `${unread} non lu(s)` : 'Aucun message non lu'}
      </p>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="messages-layout">
        <div className="card messages-list">
          {messages.length === 0 && (
            <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>Aucun message pour le moment.</p>
          )}
          {messages.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`message-row${selected?.id === m.id ? ' is-active' : ''}${!m.read_status ? ' is-unread' : ''}`}
              onClick={() => {
                setSelected(m);
                if (!m.read_status) markRead(m.id);
              }}
            >
              <span className="message-row__from">{m.name}</span>
              <span className="message-row__sub">{m.subject || '(sans objet)'}</span>
              <span className="message-row__date">
                {new Date(m.created_at).toLocaleDateString('fr-FR')}
              </span>
            </button>
          ))}
        </div>

        <div className="card message-detail">
          {selected ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem' }}>{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} style={{ color: 'var(--accent)' }}>
                    {selected.email}
                  </a>
                  {selected.subject && (
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{selected.subject}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!selected.read_status && (
                    <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem' }} onClick={() => markRead(selected.id)}>
                      <MailOpen size={16} />
                    </button>
                  )}
                  <button type="button" className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => remove(selected.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="prose" style={{ marginTop: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </p>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Reçu le {new Date(selected.created_at).toLocaleString('fr-FR')}
              </p>
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Portfolio')}`} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                <Mail size={18} /> Répondre par email
              </a>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
              Sélectionnez un message
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
