import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ isOpen, toggleSidebar, currentUser, onLogout }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏠</span>
            <h1>Devine Homz</h1>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        </div>

        <nav className="nav-menu">
          <NavLink 
            to="/admin/properties" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => window.innerWidth <= 768 && toggleSidebar()}
          >
            <span className="nav-icon">📋</span>
            Properties
          </NavLink>
          <NavLink 
            to="/admin/inquiries" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => window.innerWidth <= 768 && toggleSidebar()}
          >
            <span className="nav-icon">💬</span>
            Inquiries
          </NavLink>
        </nav>

        {currentUser && (
          <div className="user-info-section">
            <div className="user-details">
              <p className="user-email-label">Logged in as:</p>
              <p className="user-email-text">{currentUser.email}</p>
            </div>
            <button className="logout-button" onClick={onLogout}>
              Logout 🚪
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;