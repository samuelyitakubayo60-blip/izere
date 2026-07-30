import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTopicPage } from '../content';
import { useFadeIn } from '../hooks/useFadeIn';
import Icon from './Icon';
import TopicSectionRenderer from './TopicSectionRenderer';
import { useChatUI } from './FloatingChat';

const TOPIC_PATHS = {
  pregnancy: '/pregnancy',
  menstrual: '/menstrual',
  sti: '/sti',
  contraception: '/contraception',
};

export default function TopicPage({ topicKey }) {
  const { language, t } = useLanguage();
  const { openChat } = useChatUI();
  const page = getTopicPage(topicKey, language);
  const fadeRef = useFadeIn([topicKey, language]);

  if (!page) return null;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div ref={fadeRef}>
      <section className="page-hero" style={{ background: page.heroStyle }}>
        <div className="container">
          <div className="breadcrumb-custom">
            <Link to="/">{t('nav.home')}</Link>
            <Icon name="chevron-right" style={{ fontSize: '0.7rem' }} />
            <span>{page.titleAccent} {page.titleRest}</span>
          </div>
          <span className="section-label" style={page.labelStyle}>
            {page.label}
          </span>
          <h1 className="hero-title">
            <span className="gradient-text">{page.titleAccent}</span> {page.titleRest}
          </h1>
          <p className="hero-desc mt-3">{page.description}</p>
          {page.badges && (
            <div className="platform-badges mt-4">
              {page.badges.map((badge) => (
                <span key={badge.text} className="platform-badge">
                  <Icon name={badge.icon} style={{ color: badge.color }} />
                  {badge.text}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {page.banner && (
            <div className={`info-card ${page.banner.variant} mb-5 fade-in`} style={{ background: 'rgba(230,160,30,0.08)' }}>
              <h5>
                <Icon name={page.banner.icon} className="me-2" />
                {page.banner.title}
              </h5>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>{page.banner.text}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {page.sections.map((section) => (
                <TopicSectionRenderer key={section.id} section={section} t={t} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <div style={{ position: 'sticky', top: '100px' }}>
                <div className="glass-card mb-4">
                  <h5 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                    <Icon name="list-ul" className="me-2" />
                    {t('topicPage.quickNav')}
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {page.nav.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollTo(item.id)}
                        className="topic-nav-link"
                      >
                        <Icon name={item.icon} className="me-2" style={{ width: '1rem' }} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card mb-4" style={{ background: 'rgba(26,160,120,0.08)', borderColor: 'rgba(26,160,120,0.25)' }}>
                  <h5 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
                    <Icon name="comments" className="me-2" />
                    {t('topicPage.askIzere')}
                  </h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{t('topicPage.askIzereDesc')}</p>
                  <button type="button" className="btn-primary-custom mt-2" style={{ width: '100%', justifyContent: 'center' }} onClick={openChat}>
                    <Icon name="comments" />
                    {t('topicPage.askNow')}
                  </button>
                </div>

                <div className="glass-card">
                  <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                    <Icon name="lightbulb" className="me-2" style={{ color: 'var(--warning)' }} />
                    {t('topicPage.remember')}
                  </h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{page.remember}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export { TOPIC_PATHS };
