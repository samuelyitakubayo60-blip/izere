import { Link } from 'react-router-dom';
import { useFadeIn } from '../hooks/useFadeIn';
import Icon from './Icon';
import TopicSectionRenderer from './TopicSectionRenderer';
import { useChatUI } from './FloatingChat';
import T from './T';
import { getTopicPage } from '../content';

const TOPIC_PATHS = {
  pregnancy: '/pregnancy',
  menstrual: '/menstrual',
  sti: '/sti',
  contraception: '/contraception',
};

export default function TopicPage({ topicKey }) {
  const { openChat } = useChatUI();
  const page = getTopicPage(topicKey);
  const fadeRef = useFadeIn([topicKey]);

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
            <Link to="/"><T k="nav.home" /></Link>
            <Icon name="chevron-right" style={{ fontSize: '0.7rem' }} />
            <span>
              <T k={page.titleAccent} /> <T k={page.titleRest} />
            </span>
          </div>
          <span className="section-label" style={page.labelStyle}>
            <T k={page.label} />
          </span>
          <h1 className="hero-title">
            <span className="gradient-text"><T k={page.titleAccent} /></span>{' '}
            <T k={page.titleRest} />
          </h1>
          <p className="hero-desc mt-3"><T k={page.description} /></p>
          {page.badges && (
            <div className="platform-badges mt-4">
              {page.badges.map((badge) => (
                <span key={badge.text} className="platform-badge">
                  <Icon name={badge.icon} style={{ color: badge.color }} />
                  <T k={badge.text} />
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
                <T k={page.banner.title} />
              </h5>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                <T k={page.banner.text} />
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {page.sections.map((section) => (
                <TopicSectionRenderer key={section.id} section={section} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <div style={{ position: 'sticky', top: '100px' }}>
                <div className="glass-card mb-4">
                  <h5 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                    <Icon name="list-ul" className="me-2" />
                    <T k="topicPage.quickNav" />
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
                        <T k={item.label} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card mb-4" style={{ background: 'rgba(26,160,120,0.08)', borderColor: 'rgba(26,160,120,0.25)' }}>
                  <h5 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
                    <Icon name="comments" className="me-2" />
                    <T k="topicPage.askIzere" />
                  </h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}><T k="topicPage.askIzereDesc" /></p>
                  <button type="button" className="btn-primary-custom mt-2" style={{ width: '100%', justifyContent: 'center' }} onClick={openChat}>
                    <Icon name="comments" />
                    <T k="topicPage.askNow" />
                  </button>
                </div>

                <div className="glass-card">
                  <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                    <Icon name="lightbulb" className="me-2" style={{ color: 'var(--warning)' }} />
                    <T k="topicPage.remember" />
                  </h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    <T k={page.remember} />
                  </p>
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
