// src/components/PropertyDetailsPage/AddressSection.js
import React from "react";

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}</span>
    <span className="detail-value address-value">{value}</span>
  </div>
);

const AddressSection = ({
  address,
  city,
  stateCounty,
  zipPostalCode,
  area,
  country,
}) => {
  return (
    <div className="property-section card">
      <div className="section-header-flex">
        <h3 className="section-title">Address</h3>
        <a
          href={`https://maps.google.com/?q=${address}, ${city}, ${stateCounty}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-map"
        >
          <i className="fas fa-map-marked-alt"></i> Open on Google Maps
        </a>
      </div>
      <div className="details-grid address-details-grid">
        <DetailItem label="Address" value={address} />
        <DetailItem label="Zip/Postal Code" value={zipPostalCode} />
        <DetailItem label="City" value={city} />
        
        <DetailItem label="State/county" value={stateCounty} />
        <DetailItem label="Country" value={country} />
      </div>
    </div>
  );
};

export default AddressSection;
