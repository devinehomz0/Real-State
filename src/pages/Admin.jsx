import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import "../components/styles/admin.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../config/AuthContext";

function Admin() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app admin-layout">
      {/* Sticky Navbar */}
      <header className="admin-navbar">
        <div className="navbar-left">
          <span style={{ fontSize: "24px" }}>🏠</span>
          <h1 className="navbar-logo-text">Devine Homz Admin</h1>
        </div>
        <div className="navbar-right">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </header>

      <div className="admin-container">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <div className="content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Admin;
