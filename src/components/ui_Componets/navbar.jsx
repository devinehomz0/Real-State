import "../styles/navbar.css";
import React, { useState } from "react";

export default function Navbar() {
    const [sidePanelOpen, setSidePanelOpen] = useState(false);

    // Function to handle opening/closing the side panel
    const toggleSidePanel = () => setSidePanelOpen((open) => !open);
  return (
    <div className="Navbar_main">
      <div className="navbar_main">
        <div className="logo_navbar">
          <h2>Devine Homz</h2>
        </div>
        <div className="options">
          <a href="">Home</a>
          <a href="">Listings</a>
          <a href="">About Us</a>
          <a href="">Contacts</a>
              </div>
              <div className="mobile-menu-icon mobile-only" onClick={toggleSidePanel}>
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Side Panel for Mobile */}
      <div className={`side-panel ${sidePanelOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={toggleSidePanel}>&times;</div>
        <a href="" onClick={toggleSidePanel}>Home</a>
        <a href="" onClick={toggleSidePanel}>Listings</a>
        <a href="" onClick={toggleSidePanel}>About Us</a>
        <a href="" onClick={toggleSidePanel}>Contacts</a>
      </div>
      {/* Overlay for closing side panel */}
      {sidePanelOpen && <div className="side-panel-overlay" onClick={toggleSidePanel}></div>}
    
    </div>
  );
}
