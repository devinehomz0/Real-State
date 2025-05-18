import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <h1>RealEstate</h1>
        </div>
        
        <div className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} 
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="#" className="active">Home</a></li>
            <li><a href="#">Properties</a></li>
            <li><a href="#">Agents</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
        
        <div className={`header-actions ${mobileMenuOpen ? 'active' : ''}`}>
          <button className="btn btn-secondary">Sign In</button>
          <button className="btn btn-primary">Add Listing</button>
        </div>
      </div>
    </header>
  );
};

export default Header;