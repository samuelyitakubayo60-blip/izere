import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useFadeIn';
import Icon from '../components/Icon';
import T from '../components/T';
import PaymentWidget from '../components/PaymentWidget';
import { getPublicDonationSettings, initiateDonationPayment } from '../services/donateService';
import { extractPaymentUrl } from '../utils/paymentUrl';

export default function Donate() {
  const { language } = useLanguage();
  const fadeRef = useFadeIn([]);
  const [settings, setSettings] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    currency: 'RWF',
    country_code: 'RW',
    customer_first_name: '',
    customer_last_name: '',
    customer_phone: '',
    customer_email: '',
  });
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [widgetUrl, setWidgetUrl] = useState('');

  useEffect(() => {
    getPublicDonationSettings()
      .then(setSettings)
      .catch(() => setSettings({}));
  }, []);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentStatus('loading');
    setPaymentMessage('');

    try {
      const data = await initiateDonationPayment({
        ...paymentForm,
        payment_type: 'donation',
      });

      const url = extractPaymentUrl(data);
      if (data.success && url) {
        setPaymentStatus('success');
        setWidgetUrl(url);
        return;
      }
      setPaymentStatus('error');
      setPaymentMessage(data.error || data.detail || 'payment_error');
    } catch (error) {
      setPaymentStatus('error');
      setPaymentMessage(error.response?.data?.detail || error.response?.data?.error || 'network_error');
    }
  };

  const handleInputChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value,
    });
  };

  const note = language === 'rw' ? settings?.extra_note_rw : settings?.extra_note_en;
  const hasBank = Boolean(settings?.bank_name || settings?.bank_account);

  return (
    <div ref={fadeRef}>
      <section className="page-hero">
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

          <div className="glass-card mb-6">
            <h4 className="mb-2"><Icon name="credit-card" className="me-2" /> <T k="donate.onlinePayment" /></h4>
            <p className="shop-muted" style={{ marginBottom: '1.25rem' }}><T k="donate.widgetHint" /></p>
            <form onSubmit={handlePaymentSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label"><T k="donate.amountLabel" /></label>
                  <input
                    type="text"
                    name="amount"
                    value={paymentForm.amount}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="5000"
                    required
                  />
                </div>
                <div>
                  <label className="form-label"><T k="donate.currencyLabel" /></label>
                  <select
                    name="currency"
                    value={paymentForm.currency}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="RWF">RWF</option>
                    <option value="USD">USD</option>
                    <option value="XAF">XAF</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label"><T k="donate.firstNameLabel" /></label>
                  <input
                    type="text"
                    name="customer_first_name"
                    value={paymentForm.customer_first_name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label"><T k="donate.lastNameLabel" /></label>
                  <input
                    type="text"
                    name="customer_last_name"
                    value={paymentForm.customer_last_name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label"><T k="donate.phoneLabel" /></label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={paymentForm.customer_phone}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="+250..."
                    required
                  />
                </div>
                <div>
                  <label className="form-label"><T k="donate.emailLabel" /></label>
                  <input
                    type="email"
                    name="customer_email"
                    value={paymentForm.customer_email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {paymentStatus === 'loading' && (
                <div className="alert alert-info mb-4">
                  <T k="donate.processing" />
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="alert alert-danger mb-4">
                  {paymentMessage === 'network_error' ? <T k="donate.networkError" /> :
                    paymentMessage === 'payment_error' ? <T k="donate.paymentError" /> :
                      paymentMessage || <T k="donate.paymentError" />}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={paymentStatus === 'loading'}
              >
                {paymentStatus === 'loading' ? <T k="donate.processing" /> : <T k="donate.donateButton" />}
              </button>
            </form>
          </div>

          {hasBank && (
            <div className="glass-card mb-4">
              <h4><Icon name="university" className="me-2" /> <T k="donate.bankTitle" /></h4>
              {settings.bank_name && (
                <p><T k="donate.bankLabel" />: {settings.bank_name}</p>
              )}
              {settings.bank_account && (
                <p><T k="donate.accountLabel" />: {settings.bank_account}</p>
              )}
            </div>
          )}

          {note && (
            <div className="glass-card mt-4">
              <h5><T k="donate.noteTitle" /></h5>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{note}</p>
            </div>
          )}
          <p className="mt-6"><T k="donate.thanks" /></p>
        </div>
      </section>

      <PaymentWidget url={widgetUrl} onClose={() => setWidgetUrl('')} />
    </div>
  );
}
