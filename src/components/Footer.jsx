import { Link } from 'react-router-dom';
import { useChatUI } from './FloatingChat';
import Icon from './Icon';
import T from './T';
import logo from '../assets/logo.png';
import { SOCIAL_LINKS } from '../data/socialLinks';

export default function Footer() {
  const { openChat } = useChatUI();

  return (
    <footer role="contentinfo">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="footer-brand">
              <img src={logo} alt="" className="footer-brand-logo" />
              <T k="nav.siteTitle" />
            </div>
            <p className="footer-desc"><T k="footer.about" /></p>
          </div>

          <div className="footer-links">
            <h6><T k="footer.exploreTitle" /></h6>
            <Link to="/contraception"><T k="nav.contraception" /></Link>
            <Link to="/pregnancy"><T k="nav.pregnancy" /></Link>
            <Link to="/menstrual"><T k="nav.menstrual" /></Link>
            <Link to="/sti"><T k="nav.sti" /></Link>
            <Link to="/care"><T k="nav.findCare" /></Link>
            <Link to="/about"><T k="nav.about" /></Link>
            <Link to="/donate"><T k="nav.donate" /></Link>
            <Link to="/shop"><T k="nav.shop" /></Link>
          </div>

          <div className="footer-links">
            <h6><T k="footer.socialTitle" /></h6>
            <div className="footer-social">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                >
                  <Icon name={item.icon} brand />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p><T k="footer.rights" /> <T k="footer.disclaimer" /></p>
        </div>
      </div>
    </footer>
  );
}
