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
import { useScroll } from "../../config/ScrollProvider";
const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const { contactSectionRef } = useScroll(); // Get the ref from context

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-columns">
            <div className="footer-column">
              <h4>About Site</h4>
              <p>
                Divine Homz is your trusted partner in real estate, dedicated to
                helping you seamlessly buy or sell your perfect property. We
                blend modern design with tasteful simplicity and leverage
                cutting-edge technology to make your property journey
                effortless.
              </p>
            </div>

            <div className="footer-column" id="contact" ref={contactSectionRef}>
              <h4>Contact Us</h4>
              <ul className="contact-list">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>
                    38, Panchatara Society, Manish Nagar, Somalwada, Nagpur,
                    Maharashtra 440015, India
                  </span>
                </li>
                <li>
                  <FaPhoneAlt className="contact-icon" />
                  <span>(+91) 90110 67863</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>prabodh_j@yahoo.com</span>
                </li>
              </ul>
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
                  <a href="/alllistings" className="footer-link">
                    Property Listings
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Our Services</h4>
              <ul className="footer-links-list">
                <li>
                  <a className="footer-link">Buying Properties</a>
                </li>
                <li>
                  <a className="footer-link">Selling Properties</a>
                </li>
                <li>
                  <a className="footer-link">Renting Properties</a>
                </li>
                <li>
                  <a className="footer-link">Property Management</a>
                </li>
                <li>
                  <a className="footer-link">Investment Advice</a>
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
              © {new Date().getFullYear()} DevineHomz - All rights reserved
            </p>
            <div className="footer-legal-links">
              <a className="footer-link">Privacy</a>
              <a className="footer-link">Terms and Conditions</a>
              <a className="footer-link">Contact</a>
            </div>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/share/16GEm1k9Nw/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-icon-link"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.linkedin.com/in/prabodh-kumar-jangle-40a3bb30?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app "
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-icon-link"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.instagram.com/devine._.homz?igsh=MXgzcGpibTgxdmc4Zw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-icon-link"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com/@prabodhjangle5205?si=GkxwlB0vrp_K8_5I"
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
