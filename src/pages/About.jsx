import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useFadeIn } from '../hooks/useFadeIn';
import { useChatUI } from '../components/FloatingChat';
import Icon from '../components/Icon';

const PROBLEMS = [
  { icon: 'user-slash', titleKey: 'aboutProblem1Title', textKey: 'aboutProblem1Text' },
  { icon: 'lock', titleKey: 'aboutProblem2Title', textKey: 'aboutProblem2Text' },
  { icon: 'exclamation-circle', titleKey: 'aboutProblem3Title', textKey: 'aboutProblem3Text' },
  { icon: 'map-marker-alt', titleKey: 'aboutProblem4Title', textKey: 'aboutProblem4Text' },
  { icon: 'language', titleKey: 'aboutProblem5Title', textKey: 'aboutProblem5Text' },
  { icon: 'universal-access', titleKey: 'aboutProblem6Title', textKey: 'aboutProblem6Text' },
];

export default function About() {
  const { t } = useLanguage();
  const { openChat } = useChatUI();
  const fadeRef = useFadeIn([]);

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
          <div className="breadcrumb-custom">
            <Link to="/">{t('nav.home')}</Link>
            <Icon name="chevron-right" style={{ fontSize: '0.7rem' }} />
            <span>{t('nav.about')}</span>
          </div>
          <span className="section-label">{t('about.storyLabel')}</span>
          <h1 className="hero-title">
            {t('about.title')} <span className="gradient-text">IZERE</span>
          </h1>
          <p className="hero-desc mt-3">{t('about.heroDesc')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-4 mb-5 fade-in">
            <div className="glass-card h-full" style={{ borderTop: '3px solid var(--primary)' }}>
              <Icon name="bullseye" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, marginBottom: '1rem' }}>{t('home.missionTitle')}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t('home.missionText')}</p>
            </div>
            <div className="glass-card h-full" style={{ borderTop: '3px solid var(--accent)' }}>
              <Icon name="star" style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, marginBottom: '1rem' }}>{t('about.visionTitle')}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t('about.visionText')}</p>
            </div>
          </div>

          <div className="method-card fade-in">
            <h3>
              <Icon name="question-circle" style={{ color: 'var(--primary)' }} />
              {t('about.problemTitle')}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{t('about.problemIntro')}</p>
            <div className="a11y-grid">
              {PROBLEMS.map(({ icon, titleKey, textKey }) => (
                <div key={titleKey} className="a11y-card">
                  <div className="a11y-card-icon">
                    <Icon name={icon} style={{ color: 'var(--primary)', fontSize: '1.4rem' }} />
                  </div>
                  <div>
                    <h5>{t(`about.${titleKey}`)}</h5>
                    <p>{t(`about.${textKey}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card fade-in mt-4 text-center" style={{ padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>{t('about.ctaText')}</p>
            <button type="button" className="btn-primary-custom" onClick={openChat}>
              <Icon name="comments" /> {t('home.startChatting')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
