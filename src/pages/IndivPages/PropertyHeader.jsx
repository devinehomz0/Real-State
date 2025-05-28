// src/components/PropertyDetailsPage/PropertyHeader.js
import React from "react";
import { FaRupeeSign } from "react-icons/fa";

const PropertyHeader = ({
  title,
  price,
    pricePerSqFt,
  priceUnit,
  address,
  status,
  isFeatured,
}) => {
  return (
    <div className="property-header-section">
      <div className="breadcrumbs">
        <a href="/home">Home</a> > 
        <a href="/alllistings">  
          {/*propertyData.type || 'Apartment'*/ } Listings
        </a>{" "}
        > <span> {title}</span>
      </div>
      <div className="title-price-actions">
        <div className="title-location">
          <h1>{title}</h1>
          <div className="tags">
            {isFeatured && <span className="tag featured-tag">FEATURED</span>}
            <span className="tag status-tag">{status.toUpperCase()}</span>
          </div>
          <p className="location">
            <i className="fas fa-map-marker-alt"></i> {address}
          </p>
        </div>
        <div className="price-actions">
          <div className="price-info"> 
            <span className="main-price">
              <FaRupeeSign className="rupesS"></FaRupeeSign>
              {price}&nbsp;{priceUnit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
