// src/components/admin/Admin.jsx
import Sidebar from "../components/admin/Sidebar"
import "../components/styles/admin.css"; // Ensure correct path
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../config/AuthContext";
function Admin() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Failed to log out:", error);
      // Handle logout error if needed
    }
  };

  return (
    <div className="app">
      {" "}
      {/* Assuming 'app' class handles the overall layout */}
      <Sidebar />
      <main className="main-content">
        <header className="header">
          <h1>Devine Homz Admin</h1>
          {currentUser && ( // Show user info and logout if logged in
            <div className="header-actions">
              <div className="user-profile">
                <span>{currentUser.email}</span>{" "}
                {/* Display user email or name */}
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Admin;
