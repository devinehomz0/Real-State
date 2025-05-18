import { useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [searchType, setSearchType] = useState('buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1>Find Your Dream Home</h1>
            <p>Discover the perfect property that fits your lifestyle</p>
          </div>
          
          <div className="search-container">
            <div className="search-tabs">
              <button 
                className={`search-tab ${searchType === 'buy' ? 'active' : ''}`}
                onClick={() => setSearchType('buy')}>
                Buy
              </button>
              <button 
                className={`search-tab ${searchType === 'rent' ? 'active' : ''}`}
                onClick={() => setSearchType('rent')}>
                Rent
              </button>
              <button 
                className={`search-tab ${searchType === 'sell' ? 'active' : ''}`}
                onClick={() => setSearchType('sell')}>
                Sell
              </button>
            </div>
            
            <div className="search-form">
              <div className="search-group">
                <label>Location</label>
                <input 
                  type="text" 
                  placeholder="Enter city, neighborhood, or address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="search-group">
                <label>Property Type</label>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}>
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                </select>
              </div>
              
              <button className="search-button">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-services">
        <div className="container">
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>LOOKING TO BUY</h3>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v5"></path>
                  <path d="M6.3 6.3l3.55 3.55"></path>
                  <path d="M2 12h5"></path>
                  <path d="M6.3 17.7l3.55-3.55"></path>
                  <path d="M12 22v-5"></path>
                  <path d="M17.7 17.7l-3.55-3.55"></path>
                  <path d="M22 12h-5"></path>
                  <path d="M17.7 6.3l-3.55 3.55"></path>
                </svg>
              </div>
              <h3>SELL YOUR HOME</h3>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="12" rx="2"></rect>
                  <line x1="2" y1="20" x2="22" y2="20"></line>
                </svg>
              </div>
              <h3>RENT A PLACE</h3>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3>NEED HELP?</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;