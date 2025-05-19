import "../styles/Footer.css";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaAngleUp,
} from "react-icons/fa";

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-columns">
            <div className="footer-column">
              <h4>About Site</h4>
              <p>
                YourCompany is a premier real estate service dedicated to
                finding your perfect property. We combine modern aesthetics with
                tasteful simplicity and cutting-edge technology.
              </p>
              <a href="/about-us" className="footer-link read-more">
                Read more
              </a>
            </div>

            <div className="footer-column">
              <h4>Contact Us</h4>
              <ul className="contact-list">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>774 NE 84th St Miami, FL 33879</span>
                </li>
                <li>
                  <FaPhoneAlt className="contact-icon" />
                  <span>+1 (800) 990 8877</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>info@yourcompany.com</span>
                </li>
              </ul>
              <a href="/contact" className="footer-link contact-button">
                Contact us
              </a>
            </div>

            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="/" className="footer-link">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/listings" className="footer-link">
                    Property Listings
                  </a>
                </li>
                <li>
                  <a href="/agents" className="footer-link">
                    Find an Agent
                  </a>
                </li>
                <li>
                  <a href="/blog" className="footer-link">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/faq" className="footer-link">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Our Services</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="/services/buying" className="footer-link">
                    Buying Properties
                  </a>
                </li>
                <li>
                  <a href="/services/selling" className="footer-link">
                    Selling Properties
                  </a>
                </li>
                <li>
                  <a href="/services/renting" className="footer-link">
                    Renting Properties
                  </a>
                </li>
                <li>
                  <a href="/services/management" className="footer-link">
                    Property Management
                  </a>
                </li>
                <li>
                  <a href="/services/investment" className="footer-link">
                    Investment Advice
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} YourCompany - All rights reserved
            </p>
            <div className="footer-legal-links">
              <a href="/privacy-policy" className="footer-link">
                Privacy
              </a>
              <a href="/terms-conditions" className="footer-link">
                Terms and Conditions
              </a>
              <a href="/contact" className="footer-link">
                Contact
              </a>
            </div>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-icon-link"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="social-icon-link"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-icon-link"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-icon-link"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="social-icon-link"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleBackToTop}
        className="back-to-top"
        aria-label="Back to top"
      >
        <FaAngleUp />
      </button>
    </footer>
  );
};

export default Footer;
