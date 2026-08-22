import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { translateBoth } from '../i18n/translations';
import { upsertTranslationByPath } from '../services/adminService';

export default function T({ k, as: Tag = 'span', className, style }) {
  const { t, reloadFromApi } = useLanguage();
  const { canEditSite } = useAuth();
  const [open, setOpen] = useState(false);
  const [en, setEn] = useState('');
  const [rw, setRw] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const text = t(k);

  const startEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const both = translateBoth(k);
    setEn(both.en === k ? '' : both.en);
    setRw(both.rw === k ? '' : both.rw);
    setErr('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    setErr('');
    try {
      await upsertTranslationByPath({ path: k, text_en: en, text_rw: rw || null });
      await reloadFromApi();
      setOpen(false);
    } catch (ex) {
      setErr(ex.response?.data?.detail || t('editMode.error'));
    } finally {
      setSaving(false);
    }
  };

  if (!canEditSite) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <>
      <Tag
        className={`izere-editable ${className || ''}`.trim()}
        style={style}
        onClick={startEdit}
        title={t('editMode.banner')}
      >
        {text}
        <span className="izere-edit-icon" aria-hidden="true">
          ✎
        </span>
      </Tag>
      {open && (
        <div
          className="izere-edit-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <form className="izere-edit-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <p className="izere-edit-key">{k}</p>
            <label>
              {t('editMode.english')}
              <textarea value={en} onChange={(e) => setEn(e.target.value)} rows={4} required />
            </label>
            <label>
              {t('editMode.kinyarwanda')}
              <textarea value={rw} onChange={(e) => setRw(e.target.value)} rows={4} />
            </label>
            {err && <p className="izere-edit-error">{String(err)}</p>}
            <div className="izere-edit-actions">
              <button type="submit" disabled={saving}>
                {saving ? t('editMode.saving') : t('editMode.save')}
              </button>
              <button type="button" onClick={() => setOpen(false)}>
                {t('editMode.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
