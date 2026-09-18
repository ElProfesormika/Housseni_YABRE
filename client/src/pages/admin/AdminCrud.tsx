import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../api';
import { crudConfigs, type FieldConfig } from '../../config/crudFields';
import ImageUpload from '../../components/admin/ImageUpload';
import MultiImageUpload from '../../components/admin/MultiImageUpload';
import FileUpload from '../../components/admin/FileUpload';

type Row = Record<string, unknown> & { id: number };

export default function AdminCrud({ resource, title }: { resource: string; title: string }) {
  const config = crudConfigs[resource];
  const crud = api.crud<Row>(resource);

  const [items, setItems] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectOptions, setSelectOptions] = useState<Record<string, Row[]>>({});

  const load = () => crud.list().then(setItems).catch((e) => setError(e.message));

  useEffect(() => {
    load();
    const selects = config.fields.filter((f) => f.type === 'select' && f.optionsResource);
    Promise.all(
      selects.map(async (f) => {
        const rows = await api.crud<Row>(f.optionsResource as string).list();
        return [f.key, rows] as const;
      })
    )
      .then((entries) => setSelectOptions(Object.fromEntries(entries)))
      .catch((e) => setError(e.message));
  }, [resource]);

  const openNew = () => {
    const init: Record<string, unknown> = {};
    config.fields.forEach((f) => {
      if (f.type === 'number') init[f.key] = f.key === 'percentage' ? 70 : 0;
      else if (f.type === 'checkbox') init[f.key] = 0;
      else if (f.type === 'select') init[f.key] = '';
      else init[f.key] = '';
    });
    setForm(init);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (row: Row) => {
    setForm({ ...row });
    setEditing(row);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const body = { ...form };
    config.fields.forEach((f) => {
      if (f.type === 'number') body[f.key] = Number(body[f.key]) || 0;
      if (f.type === 'checkbox') body[f.key] = body[f.key] ? 1 : 0;
      if (f.type === 'select') body[f.key] = body[f.key] === '' || body[f.key] == null ? null : Number(body[f.key]);
    });
    try {
      if (editing) await crud.update(editing.id, body);
      else await crud.create(body);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer cet élément ?')) return;
    try {
      await crud.remove(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const labelForSelect = (f: FieldConfig, value: unknown) => {
    const rows = selectOptions[f.key] || [];
    const found = rows.find((r) => Number(r.id) === Number(value));
    const key = f.optionsLabel || 'title';
    return found ? String(found[key] ?? value ?? '-') : String(value ?? '-');
  };

  const renderField = (f: FieldConfig) => {
    const val = form[f.key];
    const setVal = (v: unknown) => setForm((prev) => ({ ...prev, [f.key]: v }));

    if (f.type === 'textarea') {
      return (
        <textarea
          key={f.key}
          className="form-textarea"
          value={String(val ?? '')}
          onChange={(e) => setVal(e.target.value)}
          required={f.required}
        />
      );
    }
    if (f.type === 'checkbox') {
      return (
        <input
          key={f.key}
          type="checkbox"
          checked={!!val}
          onChange={(e) => setVal(e.target.checked ? 1 : 0)}
          style={{ width: 20, height: 20 }}
        />
      );
    }
    if (f.type === 'image') {
      return <ImageUpload key={f.key} value={String(val ?? '')} onChange={(url) => setVal(url)} />;
    }
    if (f.type === 'images') {
      return <MultiImageUpload key={f.key} value={String(val ?? '')} onChange={(json) => setVal(json)} />;
    }
    if (f.type === 'file') {
      return (
        <FileUpload
          key={f.key}
          value={String(val ?? '')}
          onChange={(url) => setVal(url)}
          accept={f.accept || '*/*'}
          label="Choisir un fichier"
        />
      );
    }
    if (f.type === 'select') {
      const rows = selectOptions[f.key] || [];
      const labelKey = f.optionsLabel || 'title';
      return (
        <select
          key={f.key}
          className="form-input"
          value={val == null ? '' : String(val)}
          onChange={(e) => setVal(e.target.value)}
          required={f.required}
        >
          <option value="">Choisir…</option>
          {rows.map((row) => (
            <option key={row.id} value={row.id}>
              {String(row[labelKey] ?? row.id)}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        key={f.key}
        className="form-input"
        type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
        value={String(val ?? '')}
        onChange={(e) => setVal(e.target.value)}
        required={f.required}
        placeholder={f.placeholder}
        min={f.min}
        max={f.max}
      />
    );
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>{title}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Ajouter, modifier ou supprimer des entrées</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNew}>
          <Plus size={18} /> Ajouter
        </button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form onSubmit={save} className="card" style={{ marginBottom: '2rem', maxWidth: 640 }}>
          <h2 style={{ marginBottom: '1rem' }}>
            {editing ? 'Modifier' : 'Nouveau'} {config.label.toLowerCase()}
          </h2>
          {config.fields.map((f) => (
            <div key={f.key} className="form-group">
              <label>{f.label}</label>
              {renderField(f)}
              {f.hint ? (
                <p style={{ margin: '0.4rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{f.hint}</p>
              ) : null}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="card table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {config.listColumns.map((c) => (
                <th key={c}>{c === 'section_id' ? 'groupe' : c}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                {config.listColumns.map((c) => {
                  const field = config.fields.find((f) => f.key === c);
                  const display =
                    field?.type === 'select'
                      ? labelForSelect(field, row[c])
                      : c === 'featured'
                        ? row[c]
                          ? 'Oui'
                          : 'Non'
                        : String(row[c] ?? '-').slice(0, 60);
                  return <td key={c}>{display}</td>;
                })}
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: '0.4rem', marginRight: 4 }}
                    onClick={() => openEdit(row)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button type="button" className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => remove(row.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={config.listColumns.length + 1} style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                  Aucun élément - cliquez sur Ajouter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
