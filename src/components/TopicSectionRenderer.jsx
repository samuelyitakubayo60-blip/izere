import Icon from './Icon';
import T from './T';

function InfoCard({ block }) {
  const variant = block.variant || 'primary';
  return (
    <div className={`info-card ${variant === 'primary' ? '' : variant} mt-3`} style={block.borderColor ? { borderLeftColor: block.borderColor } : undefined}>
      <h5>
        {block.icon && <Icon name={block.icon} className="me-2" />}
        {block.title}
      </h5>
      {block.text && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>{block.text}</p>}
      {block.list && (
        <ul>
          {block.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProsCons({ data }) {
  return (
    <div className="pros-cons">
      <div className="pros">
        <h5>
          <Icon name="check-circle" className="me-1" />
          <T k="topicPage.advantages" />
        </h5>
        <ul>
          {data.pros.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="cons">
        <h5>
          <Icon name="exclamation-circle" className="me-1" />
          <T k="topicPage.disadvantages" />
        </h5>
        <ul>
          {data.cons.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function TopicSectionRenderer({ section }) {
  return (
    <div className="method-card fade-in" id={section.id}>
      <h3>
        <Icon name={section.icon} style={{ fontSize: '1.25rem', color: 'var(--primary)' }} />
        {section.title}
      </h3>
      {section.intro && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{section.intro}</p>}

      {section.grid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {section.grid.map((item) => (
            <div key={item.title} className="info-card h-full" style={{ marginBottom: 0 }}>
              <h5>
                <Icon name={item.icon} className="me-2" style={{ color: 'var(--primary)' }} />
                {item.title}
              </h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {section.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {section.stats.map((item) => (
            <div key={item.label} className="glass-card text-center" style={{ padding: '1.25rem' }}>
              <Icon name={item.icon} style={{ fontSize: '1.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</div>
              <div style={{ color: 'var(--primary)', fontSize: '1.3rem', fontWeight: 800 }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {section.glassGrid && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
          {section.glassGrid.map((item) => (
            <div key={item.title} className="glass-card text-center h-full" style={{ padding: '1.5rem' }}>
              <Icon name={item.icon} style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.75rem' }} />
              <h5 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.title}</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {section.trimesters && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {section.trimesters.map((item) => (
            <div key={item.title} className="glass-card" style={{ borderTop: `3px solid ${item.color}` }}>
              <Icon name={item.icon} style={{ fontSize: '1.5rem', color: item.color, marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.78rem', color: item.color, fontWeight: 700, marginBottom: '0.5rem' }}>{item.weeks}</div>
              <h5 style={{ fontWeight: 700 }}>{item.title}</h5>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '1rem', marginTop: '0.5rem' }}>
                {item.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {section.cycleTimeline && (
        <div className="cycle-timeline">
          {section.cycleTimeline.map((item) => (
            <div key={item.title} className="cycle-phase" style={{ borderTop: `3px solid ${item.color}` }}>
              <div className="phase-day">{item.days}</div>
              <Icon name={item.icon} style={{ fontSize: '1.25rem', color: item.color, marginBottom: '0.4rem' }} />
              <h5>{item.title}</h5>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {section.stiGrid && (
        <div className="sti-grid mt-3">
          {section.stiGrid.map((item) => (
            <div key={item.title} className="sti-card">
              <span className="sti-badge" style={item.badgeStyle}>
                {item.badge}
              </span>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {section.preventionGrid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {section.preventionGrid.map((item) => (
            <div key={item.title} className="glass-card" style={{ padding: '1.25rem' }}>
              <Icon name={item.icon} style={{ fontSize: '1.25rem', color: item.color, marginBottom: '0.5rem' }} />
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: item.color }}>{item.title}</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {section.prosCons && <ProsCons data={section.prosCons} />}

      {section.dualInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {section.dualInfo.map((block) => (
            <InfoCard key={block.title} block={{ ...block, borderColor: block.variant === 'coral' ? 'var(--coral)' : block.variant === 'accent' ? 'var(--accent)' : block.variant === 'warning' ? 'var(--warning)' : undefined }} />
          ))}
        </div>
      )}

      {section.info && <InfoCard block={section.info} />}
      {section.info2 && <InfoCard block={section.info2} />}

      {section.emergency && (
        <div className="mt-3 p-3" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
            <Icon name="phone-alt" className="me-2" />
            <T k="topicPage.emergencyRwanda" />
          </p>
          <a href="tel:912" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)', textDecoration: 'none' }}>
            912
          </a>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block' }}><T k="topicPage.emergency" /></span>
          <a href="tel:114" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'block', marginTop: '0.5rem' }}>
            114
          </a>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'block' }}><T k="topicPage.healthHotline" /></span>
        </div>
      )}
    </div>
  );
}
