import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { translateBoth } from '../i18n/translations';
import { upsertTranslationByPath } from '../services/adminService';

function stopBubble(e) {
  e.stopPropagation();
}

function stopLink(e) {
  e.preventDefault();
  e.stopPropagation();
}

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
    stopLink(e);
    const both = translateBoth(k);
    setEn(both.en === k ? '' : both.en);
    setRw(both.rw === k ? '' : both.rw);
    setErr('');
    setOpen(true);
  };

  const save = async (e) => {
    stopLink(e);
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

  const editor =
    open &&
    createPortal(
      <div
        className="izere-edit-overlay"
        role="dialog"
        aria-modal="true"
        onMouseDown={stopBubble}
        onClick={(e) => {
          stopBubble(e);
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <form
          className="izere-edit-modal"
          onMouseDown={stopBubble}
          onClick={stopBubble}
          onSubmit={save}
        >
          <p className="izere-edit-key">{k}</p>
          <label>
            {t('editMode.english')}
            <textarea
              value={en}
              onChange={(e) => setEn(e.target.value)}
              onClick={stopBubble}
              onMouseDown={stopBubble}
              rows={4}
              required
            />
          </label>
          <label>
            {t('editMode.kinyarwanda')}
            <textarea
              value={rw}
              onChange={(e) => setRw(e.target.value)}
              onClick={stopBubble}
              onMouseDown={stopBubble}
              rows={4}
            />
          </label>
          {err && <p className="izere-edit-error">{String(err)}</p>}
          <div className="izere-edit-actions">
            <button type="submit" disabled={saving} onClick={stopBubble}>
              {saving ? t('editMode.saving') : t('editMode.save')}
            </button>
            <button
              type="button"
              onClick={(e) => {
                stopLink(e);
                setOpen(false);
              }}
            >
              {t('editMode.cancel')}
            </button>
          </div>
        </form>
      </div>,
      document.body,
    );

  return (
    <>
      <Tag
        className={`izere-editable ${className || ''}`.trim()}
        style={style}
        onClick={startEdit}
        onMouseDown={stopBubble}
        title={t('editMode.banner')}
      >
        {text}
        <span className="izere-edit-icon" aria-hidden="true">
          ✎
        </span>
      </Tag>
      {editor}
    </>
  );
}
