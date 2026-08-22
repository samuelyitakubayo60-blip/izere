import { Link } from 'react-router-dom';
import { useChatUI } from './FloatingChat';
import Icon from './Icon';
import T from './T';

export default function Footer() {
  const { openChat } = useChatUI();

  return (
    <footer role="contentinfo">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="footer-brand">
              <Icon name="heartbeat" className="me-2" />
              IZERE
            </div>
            <p className="footer-desc"><T k="footer.about" /></p>
          </div>

          <div className="footer-links">
            <h6><T k="footer.exploreTitle" /></h6>
            <Link to="/contraception"><T k="nav.contraception" /></Link>
            <Link to="/pregnancy"><T k="nav.pregnancy" /></Link>
            <Link to="/menstrual"><T k="nav.menstrual" /></Link>
            <Link to="/sti"><T k="nav.sti" /></Link>
            <Link to="/about"><T k="nav.about" /></Link>
            <Link to="/donate"><T k="nav.donate" /></Link>
          </div>

          <div className="footer-links">
            <h6><T k="footer.platformTitle" /></h6>
            <Link to="/#how"><T k="footer.howItWorks" /></Link>
            <Link to="/#features"><T k="footer.features" /></Link>
            <Link to="/#accessibility"><T k="footer.accessibility" /></Link>
            <button type="button" className="footer-link-btn" onClick={openChat}>
              <T k="footer.askIzere" />
            </button>
          </div>

          <div className="footer-links">
            <h6><T k="footer.contactTitle" /></h6>
            <a href="mailto:izerehealth@gmail.com">
              <Icon name="envelope" className="me-2" style={{ color: 'var(--info)' }} />
              <T k="footer.email" />
            </a>
            <a href="tel:+250798686657">
              <Icon name="phone" className="me-2" style={{ color: 'var(--primary)' }} />
              <T k="footer.phone" />
            </a>
            <a href="tel:114">
              <Icon name="phone-alt" className="me-2" style={{ color: 'var(--primary)' }} />
              <T k="footer.healthLine" />
            </a>
            <a href="tel:912">
              <Icon name="ambulance" className="me-2" style={{ color: 'var(--danger)' }} />
              <T k="footer.emergency" />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p><T k="footer.rights" /> <T k="footer.disclaimer" /></p>
        </div>
      </div>
    </footer>
  );
}
