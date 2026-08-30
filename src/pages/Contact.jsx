import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useFadeIn';
import Icon from '../components/Icon';
import T from '../components/T';
import { submitContactForm } from '../services/contactService';
import { trackEvent } from '../utils/analytics';

export default function Contact() {
  const { t } = useLanguage();
  const fadeRef = useFadeIn([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await submitContactForm({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone || undefined
      });

      if (response.success) {
        setSuccess(t('contactPage.success'));
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        setError(response.message || t('contactPage.error'));
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setError(err.response?.data?.detail || t('contactPage.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={fadeRef}>
      <section className="page-hero">
        <div className="container">
          <span className="section-label"><T k="contactPage.subtitle" /></span>
          <h1 className="hero-title"><T k="contactPage.title" /></h1>
          <p className="hero-desc mt-3"><T k="contactPage.intro" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, marginBottom: '1.5rem' }}>
                <T k="contactPage.subtitle" />
              </h3>

              {success && (
                <div style={{
                  background: 'rgba(26,160,120,0.15)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '1rem',
                  borderRadius: '10px',
                  marginBottom: '1.5rem'
                }}>
                  {success}
                </div>
              )}

              {error && (
                <div style={{
                  background: 'rgba(220,80,110,0.15)',
                  border: '1px solid var(--coral)',
                  color: 'var(--coral)',
                  padding: '1rem',
                  borderRadius: '10px',
                  marginBottom: '1.5rem'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    <T k="contactPage.name" /> *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.8rem',
                      width: '100%'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    <T k="contactPage.email" /> *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.8rem',
                      width: '100%'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    <T k="contactPage.phone" />
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +250 798 686 657"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.8rem',
                      width: '100%'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    <T k="contactPage.message" /> *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.8rem',
                      width: '100%',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? t('contactPage.sending') : t('contactPage.send')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-card">
                <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, marginBottom: '1.5rem' }}>
                  <T k="about.contactLabel" />
                </h3>
                
                <div className="space-y-6">
                  {/* Phone / WhatsApp */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      fontSize: '1.5rem',
                      background: 'rgba(26,160,120,0.15)',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <Icon name="whatsapp" brand />
                    </div>
                    <div>
                      <h5 style={{ fontWeight: 700, margin: 0 }}>
                        <T k="contactPage.whatsapp" />
                      </h5>
                       <a
                        href="https://wa.me/250798686657"
                        onClick={() => trackEvent('referral_clicked', { type: 'whatsapp', destination: 'whatsapp_support' })}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          display: 'block',
                          marginTop: '0.25rem'
                        }}
                      >
                        +250 798 686 657
                      </a>
                      <a
                        href="tel:+250798686657"
                        onClick={() => trackEvent('referral_clicked', { type: 'phone', destination: 'phone_support' })}
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--text-muted)',
                          textDecoration: 'underline',
                          display: 'inline-block',
                          marginTop: '0.25rem'
                        }}
                      >
                        <T k="contactPage.phoneLabel" />
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      fontSize: '1.5rem',
                      background: 'rgba(30,145,220,0.15)',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--info)'
                    }}>
                      <Icon name="envelope" />
                    </div>
                    <div>
                      <h5 style={{ fontWeight: 700, margin: 0 }}>
                        <T k="contactPage.emailLabel" />
                      </h5>
                      <a
                        href="mailto:izerehealth@gmail.com"
                        onClick={() => trackEvent('referral_clicked', { type: 'email', destination: 'email_support' })}
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: 'var(--info)',
                          textDecoration: 'none',
                          display: 'block',
                          marginTop: '0.25rem'
                        }}
                      >
                        izerehealth@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
