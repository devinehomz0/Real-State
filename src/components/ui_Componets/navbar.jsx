import "../styles/navbar.css";
import React, { useState } from "react";
import { useScroll } from "../../config/ScrollProvider";
export default function Navbar() {
    const [sidePanelOpen, setSidePanelOpen] = useState(false);
    const { scrollToContact } = useScroll(); // Get the scroll function

    const handleContactClick = (event) => {
      event.preventDefault(); // Prevent default anchor jump
      scrollToContact(); // Call the function from context
    };
    // Function to handle opening/closing the side panel
  const toggleSidePanel = () => setSidePanelOpen((open) => !open);
  const whatsappNumber = "9011067863";
  const message = encodeURIComponent(
    "Hi there, I am interested in your listings!"
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
  return (
    <div className="Navbar_main">
      <div className="navbar_main">
        <div className="logo_navbar">
          <h2>Devine Homz</h2>
        </div>
        <div className="options">
          <a href="/">Home</a>
          <a href="/alllistings">Listings</a>

          <a href="#contact-us-section" onClick={handleContactClick}>
            Contacts
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            WhatsApp
          </a>
        </div>
        <div className="mobile-menu-icon mobile-only" onClick={toggleSidePanel}>
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Side Panel for Mobile */}
      <div className={`side-panel ${sidePanelOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={toggleSidePanel}>
          &times;
        </div>
        <a href="/home" onClick={toggleSidePanel}>
          Home
        </a>
        <a href="/admin" onClick={toggleSidePanel}>
          Listings
        </a>
        <a
          href="#contact-us-section"
          onClick={() => {
            handleContactClick();
            toggleSidePanel();
          }}
        >
          Contacts
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-link"
          onClick={toggleSidePanel}
        >
          WhatsApp
        </a>
      </div>
      {/* Overlay for closing side panel */}
      {sidePanelOpen && (
        <div className="side-panel-overlay" onClick={toggleSidePanel}></div>
      )}
    </div>
  );
}
