import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useChatUI } from './FloatingChat';
import Icon from './Icon';

export default function Footer() {
  const { t } = useLanguage();
  const { openChat } = useChatUI();

  return (
    <footer role="contentinfo">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="footer-brand">
              <Icon name="heartbeat" className="me-2" />
              IZERE
            </div>
            <p className="footer-desc">{t('footer.about')}</p>
          </div>

          <div className="footer-links">
            <h6>{t('footer.exploreTitle')}</h6>
            <Link to="/contraception">{t('nav.contraception')}</Link>
            <Link to="/pregnancy">{t('nav.pregnancy')}</Link>
            <Link to="/menstrual">{t('nav.menstrual')}</Link>
            <Link to="/sti">{t('nav.sti')}</Link>
            <Link to="/about">{t('nav.about')}</Link>
          </div>

          <div className="footer-links">
            <h6>{t('footer.platformTitle')}</h6>
            <Link to="/#how">{t('footer.howItWorks')}</Link>
            <Link to="/#features">{t('footer.features')}</Link>
            <Link to="/#accessibility">{t('footer.accessibility')}</Link>
            <button type="button" className="footer-link-btn" onClick={openChat}>
              {t('footer.askIzere')}
            </button>
          </div>

          <div className="footer-links">
            <h6>{t('footer.contactTitle')}</h6>
            <a href="mailto:izerehealth@gmail.com">
              <Icon name="envelope" className="me-2" style={{ color: 'var(--info)' }} />
              {t('footer.email')}
            </a>
            <a href="tel:+250798686657">
              <Icon name="phone" className="me-2" style={{ color: 'var(--primary)' }} />
              {t('footer.phone')}
            </a>
            <a href="tel:114">
              <Icon name="phone-alt" className="me-2" style={{ color: 'var(--primary)' }} />
              {t('footer.healthLine')}
            </a>
            <a href="tel:912">
              <Icon name="ambulance" className="me-2" style={{ color: 'var(--danger)' }} />
              {t('footer.emergency')}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footer.rights')} {t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
