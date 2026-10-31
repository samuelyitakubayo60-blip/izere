import T from './T';

export default function PaymentWidget({ url, onClose }) {
  if (!url) return null;

  return (
    <div className="fp-widget-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="fp-widget-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fp-widget-bar">
          <strong><T k="donate.widgetTitle" /></strong>
          <div className="fp-widget-actions">
            <a className="fp-widget-link" href={url} target="_blank" rel="noopener noreferrer">
              <T k="donate.openTab" />
            </a>
            <button type="button" className="fp-widget-close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        </div>
        <iframe
          className="fp-widget-frame"
          title="FuturaPay"
          src={url}
          allow="payment *"
        />
      </div>
    </div>
  );
}
