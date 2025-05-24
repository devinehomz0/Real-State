import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Properties.css";
import AllListings from '../../pages/Listings';

function Properties() {
 

  return (
    <div className="properties">
      <div className="properties-header">
        <div>
          <h2>Properties</h2>
          <p>Manage your real estate listings</p>
        </div>
        <Link to="/admin/create-property" className="btn btn-primary">+ Add Property</Link>
      </div>
<AllListings admin={true}></AllListings>
    
    </div>
  );
}

export default Properties;