import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">🏠</span>
        <h1>Devine Homz </h1>
      </div>
      <nav className="nav-menu">
        <NavLink to="/admin/properties" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">📋</span>
          Properties
        </NavLink>
        <NavLink to="/admin/inquiries" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">💬</span>
          Inquiries
        </NavLink>
      </nav>
      <div className="user-info">
        <div className="user-details">
          <p className="user-name">Admin User</p>
          <p className="user-email">admin@realestate.com</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;