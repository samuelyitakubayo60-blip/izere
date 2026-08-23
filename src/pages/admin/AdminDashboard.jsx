import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  listKnowledge,
  getKnowledge,
  createKnowledge,
  updateKnowledge,
  listTranslations,
  createTranslation,
  updateTranslation,
  importDefaultTranslations,
  listUsers,
  updateUserRole,
  getDonationSettingsAdmin,
  updateDonationSettings,
} from '../../services/adminService';

const CATEGORIES = ['contraception', 'pregnancy', 'menstrual', 'sti'];

const TABS = [
  { id: 'kb', label: 'Chat knowledge', admin: true },
  { id: 'tr', label: 'Site text', admin: false },
  { id: 'users', label: 'Staff', admin: true },
  { id: 'donate', label: 'Donations', admin: true },
];

function Notice({ children }) {
  if (!children) return null;
  return <p className="admin-notice">{children}</p>;
}

function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function KnowledgePanel() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({
    category: 'contraception',
    title: '',
    slug: '',
    keywords: '',
    content_en: '',
    content_rw: '',
    published: true,
  });
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      setItems(await listKnowledge());
    } catch (e) {
      setMsg(e.response?.data?.detail || e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setEditId(null);
    setForm({
      category: 'contraception',
      title: '',
      slug: '',
      keywords: '',
      content_en: '',
      content_rw: '',
      published: true,
    });
  };

  const onEdit = async (id) => {
    const row = await getKnowledge(id);
    setEditId(id);
    setForm({
      category: row.category,
      title: row.title,
      slug: row.slug || '',
      keywords: row.keywords || '',
      content_en: row.content_en,
      content_rw: row.content_rw || '',
      published: row.published !== false,
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        slug: form.slug || null,
        keywords: form.keywords || null,
        content_rw: form.content_rw || null,
      };
      if (editId) await updateKnowledge(editId, payload);
      else await createKnowledge(payload);
      setMsg('Saved.');
      reset();
      load();
    } catch (err) {
      setMsg(err.response?.data?.detail || err.message);
    }
  };

  const filtered = items.filter((row) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${row.title} ${row.category} ${row.keywords || ''}`.toLowerCase().includes(q);
  });

  return (
    <div className="admin-split">
      <div>
        <h2>Chat knowledge</h2>
        <p className="admin-lead">Facts the chatbot uses. Fill English and Kinyarwanda.</p>
        <input
          className="admin-input"
          placeholder="Search titles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="admin-list">
          {filtered.map((row) => (
            <li key={row.id}>
              <button type="button" className={editId === row.id ? 'is-active' : ''} onClick={() => onEdit(row.id)}>
                <strong>{row.title}</strong>
                <span>
                  {row.category}
                  {row.content_rw ? ' · Kinyarwanda ✓' : ' · Kinyarwanda missing'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={onSave} className="admin-card">
        <h3>{editId ? 'Edit entry' : 'New entry'}</h3>
        <Notice>{msg}</Notice>
        <Field label="Topic">
          <select
            className="admin-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Title">
          <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </Field>
        <div className="admin-row">
          <Field label="Slug (optional)">
            <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <Field label="Keywords">
            <input className="admin-input" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="condom, agakingirizo" />
          </Field>
        </div>
        <Field label="English">
          <textarea className="admin-input admin-area" value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} required />
        </Field>
        <Field label="Kinyarwanda">
          <textarea className="admin-input admin-area" value={form.content_rw} onChange={(e) => setForm({ ...form, content_rw: e.target.value })} />
        </Field>
        <label className="admin-check">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
        <div className="admin-actions">
          <button type="submit" className="admin-btn-primary">{editId ? 'Update' : 'Add'}</button>
          {editId && (
            <button type="button" className="admin-btn-ghost" onClick={reset}>New entry</button>
          )}
        </div>
      </form>
    </div>
  );
}

function TranslationsPanel() {
  const { reloadFromApi } = useLanguage();
  const [rows, setRows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ namespace: 'nav', key: '', text_en: '', text_rw: '' });
  const [msg, setMsg] = useState('');
  const [importing, setImporting] = useState(false);
  const [query, setQuery] = useState('');
  const [ns, setNs] = useState('all');

  const load = async () => {
    try {
      setRows(await listTranslations());
    } catch (e) {
      setMsg(e.response?.data?.detail || e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const namespaces = useMemo(
    () => ['all', ...Array.from(new Set(rows.map((r) => r.namespace))).sort()],
    [rows],
  );

  const filtered = rows.filter((row) => {
    if (ns !== 'all' && row.namespace !== ns) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${row.namespace}.${row.key} ${row.text_en} ${row.text_rw || ''}`.toLowerCase().includes(q);
  });

  const onSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) await updateTranslation(editId, form);
      else await createTranslation(form);
      setMsg('Saved. Site text updated.');
      await reloadFromApi();
      setEditId(null);
      setForm({ namespace: form.namespace || 'nav', key: '', text_en: '', text_rw: '' });
      load();
    } catch (err) {
      const d = err.response?.data?.detail;
      setMsg(typeof d === 'string' ? d : JSON.stringify(d));
    }
  };

  const onImportDefaults = async (overwrite = false) => {
    if (overwrite && !window.confirm('Reset all site text from the default file? Staff edits will be overwritten.')) {
      return;
    }
    setImporting(true);
    try {
      const stats = await importDefaultTranslations(overwrite);
      setMsg(`Import: ${stats.created} new, ${stats.updated} updated, ${stats.skipped} skipped.`);
      await reloadFromApi();
      load();
    } catch (err) {
      setMsg(err.response?.data?.detail || err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="admin-split">
      <div>
        <h2>Site text</h2>
        <p className="admin-lead">Or click the pencil on any public page. This list is for finding a key quickly.</p>
        <div className="admin-row">
          <input className="admin-input" placeholder="Search keys or words…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="admin-input" value={ns} onChange={(e) => setNs(e.target.value)}>
            {namespaces.map((n) => (
              <option key={n} value={n}>{n === 'all' ? 'All sections' : n}</option>
            ))}
          </select>
        </div>
        <p className="admin-count">{filtered.length} strings</p>
        <ul className="admin-list admin-list-tall">
          {filtered.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                className={editId === row.id ? 'is-active' : ''}
                onClick={() => {
                  setEditId(row.id);
                  setForm({
                    namespace: row.namespace,
                    key: row.key,
                    text_en: row.text_en,
                    text_rw: row.text_rw || '',
                  });
                }}
              >
                <strong>{row.namespace}.{row.key}</strong>
                <span>{row.text_en}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={onSave} className="admin-card">
        <h3>{editId ? 'Edit string' : 'Add string'}</h3>
        <Notice>{msg}</Notice>
        <div className="admin-row">
          <Field label="Section">
            <input className="admin-input" value={form.namespace} onChange={(e) => setForm({ ...form, namespace: e.target.value })} required />
          </Field>
          <Field label="Key">
            <input className="admin-input" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} required disabled={!!editId} />
          </Field>
        </div>
        <Field label="English">
          <textarea className="admin-input admin-area" value={form.text_en} onChange={(e) => setForm({ ...form, text_en: e.target.value })} required />
        </Field>
        <Field label="Kinyarwanda">
          <textarea className="admin-input admin-area" value={form.text_rw} onChange={(e) => setForm({ ...form, text_rw: e.target.value })} />
        </Field>
        <div className="admin-actions">
          <button type="submit" className="admin-btn-primary">{editId ? 'Update' : 'Add'}</button>
          {editId && (
            <button
              type="button"
              className="admin-btn-ghost"
              onClick={() => {
                setEditId(null);
                setForm({ namespace: 'nav', key: '', text_en: '', text_rw: '' });
              }}
            >
              Clear
            </button>
          )}
        </div>
        <div className="admin-import">
          <button type="button" className="admin-btn-ghost" disabled={importing} onClick={() => onImportDefaults(false)}>
            {importing ? 'Working…' : 'Add missing keys'}
          </button>
          <button type="button" className="admin-btn-danger" disabled={importing} onClick={() => onImportDefaults(true)}>
            Reset from file
          </button>
        </div>
      </form>
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      setUsers(await listUsers());
    } catch (e) {
      setMsg(e.response?.data?.detail || e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      setMsg('Role saved.');
      load();
    } catch (e) {
      setMsg(e.response?.data?.detail || e.message);
    }
  };

  return (
    <div>
      <h2>Staff</h2>
      <p className="admin-lead">They sign in with Google first. Then set role: editor (page text) or admin (everything).</p>
      <Notice>{msg}</Notice>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.display_name || '—'}</td>
                <td>{u.email}</td>
                <td>
                  <select className="admin-input admin-select-sm" value={u.role} onChange={(e) => onRole(u.id, e.target.value)}>
                    <option value="user">Visitor</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DonationsPanel() {
  const [form, setForm] = useState({
    momo_name: '',
    momo_number: '',
    bank_name: '',
    bank_account: '',
    paypal_url: '',
    extra_note_en: '',
    extra_note_rw: '',
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getDonationSettingsAdmin()
      .then((row) => {
        setForm({
          momo_name: row.momo_name || '',
          momo_number: row.momo_number || '',
          bank_name: row.bank_name || '',
          bank_account: row.bank_account || '',
          paypal_url: row.paypal_url || '',
          extra_note_en: row.extra_note_en || '',
          extra_note_rw: row.extra_note_rw || '',
        });
      })
      .catch((e) => setMsg(e.response?.data?.detail || e.message));
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    try {
      await updateDonationSettings(form);
      setMsg('Saved. Visible on the Donate page.');
    } catch (err) {
      setMsg(err.response?.data?.detail || err.message);
    }
  };

  return (
    <form onSubmit={onSave}>
      <h2>Donations</h2>
      <p className="admin-lead">Shown on /donate. Leave a field empty to hide that method.</p>
      <Notice>{msg}</Notice>
      <div className="admin-grid-3">
        <div className="admin-card">
          <h3>Mobile Money</h3>
          <Field label="Name">
            <input className="admin-input" value={form.momo_name} onChange={(e) => setForm({ ...form, momo_name: e.target.value })} />
          </Field>
          <Field label="Number">
            <input className="admin-input" value={form.momo_number} onChange={(e) => setForm({ ...form, momo_number: e.target.value })} />
          </Field>
        </div>
        <div className="admin-card">
          <h3>Bank</h3>
          <Field label="Bank name">
            <input className="admin-input" value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} />
          </Field>
          <Field label="Account">
            <input className="admin-input" value={form.bank_account} onChange={(e) => setForm({ ...form, bank_account: e.target.value })} />
          </Field>
        </div>
        <div className="admin-card">
          <h3>PayPal</h3>
          <Field label="URL (optional)">
            <input className="admin-input" value={form.paypal_url} onChange={(e) => setForm({ ...form, paypal_url: e.target.value })} />
          </Field>
        </div>
      </div>
      <div className="admin-card" style={{ marginTop: '1rem' }}>
        <h3>Notes on the Donate page</h3>
        <div className="admin-row">
          <Field label="English">
            <textarea className="admin-input admin-area" value={form.extra_note_en} onChange={(e) => setForm({ ...form, extra_note_en: e.target.value })} />
          </Field>
          <Field label="Kinyarwanda">
            <textarea className="admin-input admin-area" value={form.extra_note_rw} onChange={(e) => setForm({ ...form, extra_note_rw: e.target.value })} />
          </Field>
        </div>
        <div className="admin-actions">
          <button type="submit" className="admin-btn-primary">Save donation details</button>
        </div>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState(isAdmin ? 'kb' : 'tr');
  const tabs = TABS.filter((t) => isAdmin || !t.admin);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">IZERE Health Hub</p>
          <h1>{isAdmin ? 'Admin dashboard' : 'Editor dashboard'}</h1>
        </div>
        <Link to="/" className="admin-back">← Back to site</Link>
      </header>
      <p className="admin-lead">
        On public pages, click the pencil on any sentence. Use the tabs below for chatbot facts, staff, and donations.
      </p>
      <div className="admin-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? 'is-active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="admin-body">
        {tab === 'kb' && isAdmin && <KnowledgePanel />}
        {tab === 'tr' && <TranslationsPanel />}
        {tab === 'users' && isAdmin && <UsersPanel />}
        {tab === 'donate' && isAdmin && <DonationsPanel />}
      </div>
    </div>
  );
}
