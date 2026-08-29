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

  return (
    <div ref={fadeRef}>
      <section className="page-hero" style={{ background: page.heroStyle }}>
        <div className="container">
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

          <div className="topic-page-main">
              {page.sections.map((section) => (
                <TopicSectionRenderer key={section.id} section={section} />
              ))}
              <div className="glass-card topic-page-cta">
                <h5 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  <Icon name="comments" className="me-2" />
                  <T k="topicPage.askIzere" />
                </h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}><T k="topicPage.askIzereDesc" /></p>
                <button type="button" className="btn-primary-custom mt-2" onClick={openChat}>
                  <Icon name="comments" />
                  <T k="topicPage.askNow" />
                </button>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '1rem 0 0' }}>
                  <T k={page.remember} />
                </p>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}

export { TOPIC_PATHS };
