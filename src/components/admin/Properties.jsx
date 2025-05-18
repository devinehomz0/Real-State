import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Properties.css";

function Properties() {
  const [properties] = useState([
    {
      id: 1,
      title: 'Modern Lakefront Villa',
      location: 'Seattle, WA',
      price: 1250000,
      beds: 4,
      baths: 3.5,
      sqft: 3200,
      status: 'For Sale',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'
    },
    {
      id: 2,
      title: 'Downtown Luxury Apartment',
      location: 'Chicago, IL',
      price: 750000,
      beds: 2,
      baths: 2,
      sqft: 1450,
      status: 'For Sale',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    },
    {
      id: 3,
      title: 'Countryside Ranch House',
      location: 'Austin, TX',
      price: 550000,
      beds: 3,
      baths: 2,
      sqft: 2100,
      status: 'For Rent',
      image: 'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg'
    }
  ]);

  return (
    <div className="properties">
      <div className="properties-header">
        <div>
          <h2>Properties</h2>
          <p>Manage your real estate listings</p>
        </div>
        <Link to="/admin/create-property" className="btn btn-primary">+ Add Property</Link>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search properties..." />
        <select>
          <option value="">All Statuses</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>

      <div className="properties-grid">
        {properties.map(property => (
          <div key={property.id} className="property-card">
            <div className="property-image">
              <img src={property.image} alt={property.title} />
              <span className="property-status">{property.status}</span>
            </div>
            <div className="property-content">
              <h3>{property.title}</h3>
              <p className="property-location">{property.location}</p>
              <p className="property-price">${property.price.toLocaleString()}</p>
              <div className="property-features">
                <span>{property.beds} bd</span>
                <span>{property.baths} ba</span>
                <span>{property.sqft.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Properties;