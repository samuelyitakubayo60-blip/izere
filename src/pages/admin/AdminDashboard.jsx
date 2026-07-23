import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  listKnowledge,
  getKnowledge,
  createKnowledge,
  updateKnowledge,
  listTranslations,
  createTranslation,
  updateTranslation,
  importDefaultTranslations,
} from '../../services/adminService';

const CATEGORIES = ['contraception', 'pregnancy', 'menstrual', 'sti'];

function KnowledgePanel() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Knowledge base (chatbot)</h2>
      <p className="text-sm text-gray-600 mb-4">
        Trusted health facts for RAG. Always add <strong>English and Kinyarwanda</strong>.
      </p>
      {msg && <p className="text-sm mb-3 text-pink-700">{msg}</p>}
      <form onSubmit={onSave} className="grid gap-3 mb-8 bg-white p-4 rounded-lg shadow-sm">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded px-3 py-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          placeholder="Slug (optional)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          placeholder="Keywords: condom, ibigabo, …"
          value={form.keywords}
          onChange={(e) => setForm({ ...form, keywords: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <textarea
          placeholder="English content"
          value={form.content_en}
          onChange={(e) => setForm({ ...form, content_en: e.target.value })}
          className="border rounded px-3 py-2 min-h-[100px]"
          required
        />
        <textarea
          placeholder="Kinyarwanda content"
          value={form.content_rw}
          onChange={(e) => setForm({ ...form, content_rw: e.target.value })}
          className="border rounded px-3 py-2 min-h-[100px]"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        <div className="flex gap-2">
          <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg">
            {editId ? 'Update' : 'Create'}
          </button>
          {editId && (
            <button type="button" onClick={reset} className="border px-4 py-2 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="divide-y bg-white rounded-lg shadow-sm">
        {items.map((row) => (
          <li key={row.id} className="p-3 flex justify-between items-center text-sm">
            <span>
              <strong>{row.title}</strong>
              <span className="text-gray-500 ml-2">({row.category})</span>
              {row.content_rw ? ' · RW ✓' : ' · RW —'}
            </span>
            <button type="button" onClick={() => onEdit(row.id)} className="text-pink-600">
              Edit
            </button>
          </li>
        ))}
      </ul>
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

  const onSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateTranslation(editId, form);
      } else {
        await createTranslation(form);
      }
      setMsg('Saved. Site text updated.');
      await reloadFromApi();
      setEditId(null);
      setForm({ namespace: 'nav', key: '', text_en: '', text_rw: '' });
      load();
    } catch (err) {
      const d = err.response?.data?.detail;
      setMsg(typeof d === 'string' ? d : JSON.stringify(d));
    }
  };

  const onImportDefaults = async (overwrite = false) => {
    if (
      overwrite &&
      !window.confirm('Overwrite all existing translations with defaults from translations.js?')
    ) {
      return;
    }
    setImporting(true);
    try {
      const stats = await importDefaultTranslations(overwrite);
      setMsg(
        `Import done: ${stats.created} created, ${stats.updated} updated, ${stats.skipped} skipped (${stats.total_keys} keys in file).`,
      );
      await reloadFromApi();
      load();
    } catch (err) {
      setMsg(err.response?.data?.detail || err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Site translations</h2>
      <p className="text-sm text-gray-600 mb-4">
        Menus, page titles, labels — namespace e.g. nav, home, chat, pages.contraception.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          disabled={importing}
          onClick={() => onImportDefaults(false)}
          className="border border-pink-600 text-pink-600 px-3 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {importing ? 'Importing…' : 'Import missing from translations.js'}
        </button>
        <button
          type="button"
          disabled={importing}
          onClick={() => onImportDefaults(true)}
          className="border border-gray-400 text-gray-700 px-3 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Reset all from defaults
        </button>
      </div>
      {msg && <p className="text-sm mb-3 text-pink-700">{msg}</p>}
      <form onSubmit={onSave} className="grid gap-3 mb-8 bg-white p-4 rounded-lg shadow-sm">
        <input
          placeholder="Namespace"
          value={form.namespace}
          onChange={(e) => setForm({ ...form, namespace: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          placeholder="Key (e.g. home, title)"
          value={form.key}
          onChange={(e) => setForm({ ...form, key: e.target.value })}
          className="border rounded px-3 py-2"
          required
          disabled={!!editId}
        />
        <input
          placeholder="English"
          value={form.text_en}
          onChange={(e) => setForm({ ...form, text_en: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          placeholder="Kinyarwanda"
          value={form.text_rw}
          onChange={(e) => setForm({ ...form, text_rw: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-lg w-fit">
          {editId ? 'Update' : 'Create'}
        </button>
      </form>
      <ul className="divide-y bg-white rounded-lg shadow-sm text-sm max-h-96 overflow-auto">
        {rows.map((row) => (
          <li
            key={row.id}
            className="p-3 cursor-pointer hover:bg-pink-50"
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
            <div className="text-gray-600 truncate">EN: {row.text_en}</div>
            <div className="text-gray-600 truncate">RW: {row.text_rw || '—'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('kb');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        <Link to="/" className="text-pink-600 text-sm">
          ← Back to site
        </Link>
      </div>
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab('kb')}
          className={`px-4 py-2 rounded-lg ${tab === 'kb' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}
        >
          Knowledge base
        </button>
        <button
          type="button"
          onClick={() => setTab('tr')}
          className={`px-4 py-2 rounded-lg ${tab === 'tr' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}
        >
          Site translations
        </button>
      </div>
      {tab === 'kb' ? <KnowledgePanel /> : <TranslationsPanel />}
    </div>
  );
}
