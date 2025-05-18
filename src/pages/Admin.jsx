import Sidebar from "../components/admin/Sidebar";
import "../components/styles/admin.css";
import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <header className="header">
          <h1>Devine Homz Admin</h1>
          <div className="header-actions">
            <div className="user-profile">
              <button>Logout</button>
            </div>
          </div>
        </header>
        <div className="content">
          <Outlet /> {/* THIS IS ESSENTIAL! */}
        </div>
      </main>
    </div>
  );
}

export default Admin;
