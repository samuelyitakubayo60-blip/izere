import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function EditModeBanner() {
  const { canEditSite, isAdmin } = useAuth();
  const { t } = useLanguage();
  if (!canEditSite) return null;
  return (
    <div className="izere-edit-banner">
      <span>{t('editMode.banner')}</span>
      <Link to="/admin">{isAdmin ? t('nav.admin') : t('nav.dashboard')}</Link>
    </div>
  );
}
