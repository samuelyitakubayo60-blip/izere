import { Link } from 'react-router-dom';
import { useFadeIn } from '../hooks/useFadeIn';
import { useChatUI } from '../components/FloatingChat';
import Icon from '../components/Icon';
import T from '../components/T';

const PROBLEMS = [
  { icon: 'user-slash', n: 1 },
  { icon: 'lock', n: 2 },
  { icon: 'exclamation-circle', n: 3 },
  { icon: 'map-marker-alt', n: 4 },
  { icon: 'language', n: 5 },
  { icon: 'universal-access', n: 6 },
];

const A11Y = [
  { icon: 'deaf', key: 'Hear' },
  { icon: 'low-vision', key: 'Vision' },
  { icon: 'wheelchair', key: 'Mobility' },
  { icon: 'comment', key: 'Speech' },
  { icon: 'brain', key: 'Learn' },
  { icon: 'wifi', key: 'Connect' },
];

const INNOVATIONS = [
  { icon: 'language', color: 'var(--primary)', bg: 'rgba(26,160,120,0.15)', key: 'Lang' },
  { icon: 'robot', color: 'var(--accent)', bg: 'rgba(130,60,200,0.15)', key: 'Ai' },
  { icon: 'universal-access', color: 'var(--info)', bg: 'rgba(30,145,220,0.15)', key: 'Inclusive' },
  { icon: 'exclamation-triangle', color: 'var(--warning)', bg: 'rgba(230,160,30,0.15)', key: 'Emergency' },
  { icon: 'comments', color: 'var(--primary)', bg: 'rgba(26,160,120,0.1)', key: 'Access' },
  { icon: 'hands-helping', color: 'var(--coral)', bg: 'rgba(220,80,110,0.15)', key: 'Hybrid' },
];

export default function About() {
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
            <Link to="/"><T k="nav.home" /></Link>
            <Icon name="chevron-right" style={{ fontSize: '0.7rem' }} />
            <span><T k="nav.about" /></span>
          </div>
          <span className="section-label"><T k="about.storyLabel" /></span>
          <h1 className="hero-title">
            <T k="about.title" /> <span className="gradient-text">IZERE <T k="home.brandAccent" /></span>
          </h1>
          <p className="hero-desc mt-3"><T k="about.heroDesc" /></p>
        </div>
      </section>

      <section className="section" id="mission">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-4 mb-5 fade-in">
            <div className="glass-card h-full" style={{ borderTop: '3px solid var(--primary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, marginBottom: '1rem' }}>
                <T k="about.missionTitle" />
              </h3>
              <p style={{ color: 'var(--text-muted)' }}><T k="about.missionText" /></p>
            </div>
            <div className="glass-card h-full" style={{ borderTop: '3px solid var(--accent)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌟</div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, marginBottom: '1rem' }}>
                <T k="about.visionTitle" />
              </h3>
              <p style={{ color: 'var(--text-muted)' }}><T k="about.visionText" /></p>
            </div>
          </div>

          <div className="method-card fade-in" id="problem">
            <h3>
              <span style={{ fontSize: '1.5rem' }}>❓</span> <T k="about.problemTitle" />
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}><T k="about.problemIntro" /></p>
            <div className="a11y-grid">
              {PROBLEMS.map(({ icon, n }) => (
                <div key={n} className="a11y-card">
                  <div className="a11y-card-icon">
                    <Icon name={icon} style={{ color: 'var(--primary)', fontSize: '1.4rem' }} />
                  </div>
                  <div>
                    <h5><T k={`about.problem${n}Title`} /></h5>
                    <p><T k={`about.problem${n}Text`} /></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'hsl(220,18%,10%)' }} id="disability">
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label"><T k="about.a11yLabel" /></span>
            <h2 className="section-title">
              <T k="about.a11yHeading" /> <span className="gradient-text"><T k="about.a11yAccent" /></span>
            </h2>
            <p className="section-sub"><T k="about.a11ySub" /></p>
          </div>
          <div className="a11y-grid fade-in">
            {A11Y.map(({ icon, key }) => (
              <div key={key} className="a11y-card">
                <div className="a11y-card-icon">
                  <Icon name={icon} style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
                </div>
                <div>
                  <h5><T k={`about.a11y${key}Title`} /></h5>
                  <p><T k={`about.a11y${key}Text`} /></p>
                </div>
              </div>
            ))}
          </div>
          <div
            className="glass-card mt-4 fade-in"
            style={{ background: 'rgba(26,160,120,0.06)', borderColor: 'rgba(26,160,120,0.2)' }}
          >
            <h4 style={{ fontWeight: 800, marginBottom: '0.75rem' }}><T k="about.a11yCommitTitle" /></h4>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}><T k="about.a11yCommitText" /></p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'hsl(220,18%,10%)' }} id="innovation">
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label"><T k="about.innovLabel" /></span>
            <h2 className="section-title">
              <T k="about.innovHeading" /> <span className="gradient-text"><T k="about.innovAccent" /></span>
            </h2>
          </div>
          <div className="features-grid fade-in">
            {INNOVATIONS.map(({ icon, color, bg, key }) => (
              <div key={key} className="feature-card">
                <div className="feature-icon-wrap" style={{ background: bg }}>
                  <Icon name={icon} style={{ color }} />
                </div>
                <h4><T k={`about.innov${key}Title`} /></h4>
                <p><T k={`about.innov${key}Text`} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'hsl(220,18%,10%)' }} id="contact">
        <div className="container">
          <div className="text-center mb-5 fade-in">
            <span className="section-label"><T k="about.contactLabel" /></span>
            <h2 className="section-title">
              <T k="about.contactHeading" /> <span className="gradient-text"><T k="about.contactAccent" /></span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 fade-in">
            <div className="glass-card text-center h-full">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📞</div>
              <h5 style={{ fontWeight: 700 }}><T k="about.contactHotline" /></h5>
              <a href="tel:114" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'none', display: 'block' }}>
                114
              </a>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                <T k="about.contactHotlineSub" />
              </p>
            </div>
            <div className="glass-card text-center h-full">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚨</div>
              <h5 style={{ fontWeight: 700 }}><T k="about.contactEmergency" /></h5>
              <a href="tel:912" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)', textDecoration: 'none', display: 'block' }}>
                912
              </a>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                <T k="about.contactEmergencySub" />
              </p>
            </div>
            <div className="glass-card text-center h-full">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📧</div>
              <h5 style={{ fontWeight: 700 }}><T k="about.contactEmail" /></h5>
              <a
                href="mailto:izerehealth@gmail.com"
                style={{ color: 'var(--info)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginTop: '0.75rem' }}
              >
                izerehealth@gmail.com
              </a>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                <T k="about.contactEmailSub" />
              </p>
            </div>
          </div>
          <div
            className="glass-card mt-4 fade-in text-center"
            style={{
              background: 'linear-gradient(135deg,rgba(26,160,120,0.08),rgba(130,60,200,0.08))',
              borderColor: 'rgba(26,160,120,0.2)',
              padding: '2.5rem',
            }}
          >
            <h4 style={{ fontWeight: 800, marginBottom: '0.75rem' }}><T k="about.ctaTitle" /></h4>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}><T k="about.ctaText" /></p>
            <button type="button" className="btn-primary-custom" style={{ margin: '0 auto' }} onClick={openChat}>
              <Icon name="comments" /> <T k="about.ctaButton" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
