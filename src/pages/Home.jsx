import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useChatUI } from '../components/FloatingChat';
import { useFadeIn } from '../hooks/useFadeIn';
import Icon from '../components/Icon';
import izereImage from '../assets/izere.jpeg';

const TOPICS = [
  { to: '/contraception', cls: 't-contraception', icon: 'pills', ic: 'ic-contraception', titleKey: 'topicContraception', descKey: 'topicContraceptionDesc' },
  { to: '/pregnancy', cls: 't-pregnancy', icon: 'baby', ic: 'ic-pregnancy', titleKey: 'topicPregnancy', descKey: 'topicPregnancyDesc' },
  { to: '/menstrual', cls: 't-menstrual', icon: 'calendar-alt', ic: 'ic-menstrual', titleKey: 'topicMenstrual', descKey: 'topicMenstrualDesc' },
  { to: '/sti', cls: 't-std', icon: 'shield-virus', ic: 'ic-std', titleKey: 'topicSti', descKey: 'topicStiDesc' },
];

const FEATURES = [
  { icon: 'lock', color: 'var(--primary)', bg: 'rgba(26,160,120,0.15)', titleKey: 'featurePrivateTitle', textKey: 'featurePrivateText' },
  { icon: 'clock', color: 'var(--accent)', bg: 'rgba(130,60,200,0.15)', titleKey: 'featureChatTitle', textKey: 'featureChatText' },
  { icon: 'language', color: 'var(--info)', bg: 'rgba(30,145,220,0.15)', titleKey: 'featureLangTitle', textKey: 'featureLangText' },
  { icon: 'user-md', color: 'var(--warning)', bg: 'rgba(230,160,30,0.15)', titleKey: 'featureTrustedTitle', textKey: 'featureTrustedText' },
  { icon: 'comments', color: 'var(--coral)', bg: 'rgba(220,80,110,0.15)', titleKey: 'featureAskTitle', textKey: 'featureAskText' },
  { icon: 'universal-access', color: 'var(--primary)', bg: 'rgba(26,160,120,0.1)', titleKey: 'featureAccessTitle', textKey: 'featureAccessText' },
];

const HOW_STEPS = ['how1', 'how2', 'how3', 'how4'];

const A11Y = [
  { icon: 'deaf', titleKey: 'a11yHearTitle', textKey: 'a11yHearText' },
  { icon: 'low-vision', titleKey: 'a11yVisionTitle', textKey: 'a11yVisionText' },
  { icon: 'wheelchair', titleKey: 'a11yMobilityTitle', textKey: 'a11yMobilityText' },
  { icon: 'comment', titleKey: 'a11ySpeechTitle', textKey: 'a11ySpeechText' },
  { icon: 'brain', titleKey: 'a11yLearnTitle', textKey: 'a11yLearnText' },
  { icon: 'wifi', titleKey: 'a11yConnectTitle', textKey: 'a11yConnectText' },
];

export default function Home() {
  const { t } = useLanguage();
  const { openChat } = useChatUI();
  const fadeRef = useFadeIn([]);

  return (
    <div ref={fadeRef}>
      <section id="home" className="hero-section" aria-labelledby="hero-heading">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="hero-badge">
                <Icon name="shield-alt" /> {t('home.badgePrivate')}
              </div>
              <h1 className="hero-title" id="hero-heading">
                IZERE <span className="gradient-text">{t('home.brandAccent')}</span>
              </h1>
              <p className="hero-desc mt-3">{t('home.tagline')}</p>
              <p className="hero-desc">{t('home.headline')}</p>
              <p className="hero-desc" style={{ fontSize: '0.95rem' }}>{t('home.subheadline')}</p>
              <div className="hero-btns flex flex-wrap gap-3 mt-4">
                <button type="button" className="btn-primary-custom" onClick={openChat}>
                  <Icon name="comments" /> {t('home.startChatting')}
                </button>
                <Link to="/about" className="btn-outline-custom">
                  <Icon name="info-circle" /> {t('home.learnMore')}
                </Link>
              </div>
              <div className="platform-badges mt-4">
                <span className="platform-badge"><Icon name="globe" style={{ color: 'var(--accent)' }} /> {t('home.badgeWeb')}</span>
                <span className="platform-badge"><Icon name="language" style={{ color: 'var(--warning)' }} /> {t('home.badgeLang')}</span>
                <span className="platform-badge"><Icon name="lock" style={{ color: 'var(--primary)' }} /> {t('home.badgeNoAccount')}</span>
              </div>
            </div>
            <div className="phone-mockup-wrap">
              <div className="hero-image-frame">
                <img src={izereImage} alt={t('home.imageAlt')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="topics" className="section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">{t('home.topicsTitle')}</span>
            <h2 className="section-title">{t('home.topicsHeading')}</h2>
            <p className="section-sub">{t('home.topicsIntro')}</p>
          </div>
          <div className="topic-grid fade-in">
            {TOPICS.map(({ to, cls, icon, ic, titleKey, descKey }) => (
              <Link key={to} to={to} className={`topic-card ${cls}`}>
                <div className={`topic-icon ${ic}`}>
                  <Icon name={icon} />
                </div>
                <h3>{t(`home.${titleKey}`)}</h3>
                <p>{t(`home.${descKey}`)}</p>
                <span className="topic-arrow">
                  {t('home.readMore')} <Icon name="arrow-right" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section" style={{ background: 'hsl(220,18%,10%)' }}>
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label">{t('home.whyIzere')}</span>
            <h2 className="section-title">{t('home.whyHeading')}</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map(({ icon, color, bg, titleKey, textKey }) => (
              <div key={titleKey} className="feature-card fade-in">
                <div className="feature-icon-wrap" style={{ background: bg }}>
                  <Icon name={icon} style={{ color }} />
                </div>
                <h4>{t(`home.${titleKey}`)}</h4>
                <p>{t(`home.${textKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label">{t('home.howLabel')}</span>
            <h2 className="section-title">{t('home.howHeading')}</h2>
            <p className="section-sub">{t('home.howSub')}</p>
          </div>
          <div className="how-grid fade-in">
            {HOW_STEPS.map((key, i) => (
              <div key={key} className="how-step">
                <div className="how-num">{i + 1}</div>
                <h4>{t(`home.${key}Title`)}</h4>
                <p>{t(`home.${key}Text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats-bar fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                ['statYouth', '500K+'],
                ['statDistricts', '30'],
                ['statHours', '24/7'],
                ['statFree', '100%'],
              ].map(([key, val]) => (
                <div key={key} className="stat-item">
                  <div className="stat-num">{val}</div>
                  <div className="stat-label">{t(`home.${key}`)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="accessibility" className="section" style={{ background: 'hsl(220,18%,10%)' }}>
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label">{t('home.a11yLabel')}</span>
            <h2 className="section-title">
              {t('home.a11yHeading')} <span className="gradient-text">{t('home.a11yAccent')}</span>
            </h2>
            <p className="section-sub">{t('home.a11ySub')}</p>
          </div>
          <div className="a11y-grid fade-in">
            {A11Y.map(({ icon, titleKey, textKey }) => (
              <div key={titleKey} className="a11y-card">
                <div className="a11y-card-icon">
                  <Icon name={icon} style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
                </div>
                <div>
                  <h5>{t(`home.${titleKey}`)}</h5>
                  <p>{t(`home.${textKey}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="info-card warning fade-in" style={{ background: 'rgba(230,160,30,0.08)' }}>
            <h5>
              <Icon name="exclamation-triangle" className="me-2" />
              {t('home.noticeTitle')}
            </h5>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>{t('home.noticeText')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
