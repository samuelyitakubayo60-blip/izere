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
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    currency: 'XAF',
    country_code: 'RW',
    customer_first_name: '',
    customer_last_name: '',
    customer_phone: '',
    customer_email: ''
  });
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, loading, success, error
  const [paymentMessage, setPaymentMessage] = useState('');

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
      const response = await fetch('/api/donate/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentForm,
          payment_type: 'donation'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus('success');
        setPaymentMessage('');
        // Redirect to payment gateway if URL is provided
        if (data.data?.payment_url) {
          window.location.href = data.data.payment_url;
        } else {
          // Fallback to payment status page
          window.location.href = `/payment/status?status=success&type=donation&transaction_id=${data.customer_transaction_id}`;
        }
      } else {
        setPaymentStatus('error');
        setPaymentMessage(data.error || 'payment_error');
      }
    } catch (error) {
      setPaymentStatus('error');
      setPaymentMessage('network_error');
    }
  };

  const handleInputChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value
    });
  };

  const note = language === 'rw' ? settings?.extra_note_rw : settings?.extra_note_en;
  const hasMomo = Boolean(settings?.momo_number || settings?.momo_name);
  const hasBank = Boolean(settings?.bank_name || settings?.bank_account);
  const hasPaypal = Boolean(settings?.paypal_url);
  const hasAny = hasMomo || hasBank || hasPaypal;

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
          
          {/* Online Payment Form */}
          <div className="glass-card mb-6">
            <h4 className="mb-4"><Icon name="credit-card" className="me-2" /> <T k="donate.onlinePayment" /></h4>
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
                    placeholder="Enter amount"
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
                    <option value="XAF">XAF (CFA Franc)</option>
                    <option value="RWF">RWF (Rwandan Franc)</option>
                    <option value="USD">USD (US Dollar)</option>
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
                    placeholder="Your first name"
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
                    placeholder="Your last name"
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
                    placeholder="+250 XXX XXX XXX"
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
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              {paymentStatus === 'loading' && (
                <div className="alert alert-info mb-4">
                  <T k="donate.processing" />
                </div>
              )}
              
              {paymentStatus === 'success' && (
                <div className="alert alert-success mb-4">
                  <T k="donate.paymentSuccess" />
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

          <h3 className="section-title mb-4">Other Payment Methods</h3>
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
