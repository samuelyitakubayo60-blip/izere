import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useFadeIn';
import Icon from '../components/Icon';
import T from '../components/T';
import { getPublicDonationSettings } from '../services/donateService';

export default function Donate() {
  const { language } = useLanguage();
  const fadeRef = useFadeIn([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getPublicDonationSettings()
      .then(setSettings)
      .catch(() => setSettings({}));
  }, []);

  const note = language === 'rw' ? settings?.extra_note_rw : settings?.extra_note_en;
  const hasMomo = Boolean(settings?.momo_number || settings?.momo_name);
  const hasBank = Boolean(settings?.bank_name || settings?.bank_account);
  const hasPaypal = Boolean(settings?.paypal_url);
  const hasAny = hasMomo || hasBank || hasPaypal;

  return (
    <div ref={fadeRef}>
      <section
        className="page-hero"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%,hsl(170,40%,10%) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,hsl(280,30%,12%) 0%,transparent 50%),var(--bg-dark)',
        }}
      >
        <div className="container">
          <span className="section-label"><T k="donate.label" /></span>
          <h1 className="hero-title"><T k="donate.title" /></h1>
          <p className="hero-desc mt-3"><T k="donate.intro" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title mb-4"><T k="donate.howTitle" /></h2>
          <ul className="mb-8" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <li><T k="donate.how1" /></li>
            <li><T k="donate.how2" /></li>
            <li><T k="donate.how3" /></li>
          </ul>

          <h2 className="section-title mb-4"><T k="donate.methodsTitle" /></h2>
          {settings && !hasAny && (
            <p style={{ color: 'var(--text-muted)' }}><T k="donate.empty" /></p>
          )}
          <div className="grid md:grid-cols-3 gap-4">
            {hasMomo && (
              <div className="glass-card">
                <h4><Icon name="mobile-alt" className="me-2" /> <T k="donate.momoTitle" /></h4>
                {settings.momo_name && (
                  <p><T k="donate.nameLabel" />: {settings.momo_name}</p>
                )}
                {settings.momo_number && (
                  <p><T k="donate.numberLabel" />: {settings.momo_number}</p>
                )}
              </div>
            )}
            {hasBank && (
              <div className="glass-card">
                <h4><Icon name="university" className="me-2" /> <T k="donate.bankTitle" /></h4>
                {settings.bank_name && (
                  <p><T k="donate.bankLabel" />: {settings.bank_name}</p>
                )}
                {settings.bank_account && (
                  <p><T k="donate.accountLabel" />: {settings.bank_account}</p>
                )}
              </div>
            )}
            {hasPaypal && (
              <div className="glass-card">
                <h4><T k="donate.paypalTitle" /></h4>
                <a href={settings.paypal_url} target="_blank" rel="noopener noreferrer">
                  {settings.paypal_url}
                </a>
              </div>
            )}
          </div>

          {note && (
            <div className="glass-card mt-4">
              <h5><T k="donate.noteTitle" /></h5>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{note}</p>
            </div>
          )}
          <p className="mt-6"><T k="donate.thanks" /></p>
        </div>
      </section>
    </div>
  );
}
