// src/components/PropertyDetailsPage/OverviewSection.js
import React from "react";

const OverviewItem = ({ iconClass, value, label }) => (
  <div className="overview-item">
    <i className={`fas ${iconClass} overview-icon`}></i>
    <div className="overview-text">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  </div>
);

const OverviewSection = ({
  propertyType,
  bedrooms,
  bathrooms,
  garage,
  sqFt,
  yearBuilt,
  mapImageUrl,
}) => {
  return (
    <div className="property-section card over_none">
      <h3 className="section-title">Overview</h3>
      <div className="overview-grid">
        <div className="overview-details">
          <OverviewItem
            iconClass="fa-building"
            value={propertyType}
            label="Property Type"
          />
          <OverviewItem iconClass="fa-bed" value={bedrooms} label="Bedrooms" />
          <OverviewItem
            iconClass="fa-bath"
            value={bathrooms}
            label="Bathrooms"
          />
        { garage!=="no"&& <OverviewItem
            iconClass="fa-warehouse"
            value={garage}
            label="Garage"
          />}{" "}
          {/* Changed from fa-car to fa-warehouse as per image*/}
          <OverviewItem
            iconClass="fa-ruler-combined"
            value={sqFt}
            label="Sq Ft"
          />{" "}
          {/* Changed from fa-vector-square for better match */}
         
        </div>
       
      </div>
    </div>
  );
};

export default OverviewSection;
