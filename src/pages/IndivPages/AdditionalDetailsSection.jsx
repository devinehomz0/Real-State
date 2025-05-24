// src/components/PropertyDetailsPage/AdditionalDetailsSection.js
import React from "react";

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">
      {Array.isArray(value) ? value.join(", ") : value}
    </span>
  </div>
);

const AdditionalDetailsSection = ({
  deposit,
  poolSize,
  lastRemodelYear,
  amenities,
  additionalRooms,
  equipment,
}) => {
  return (
    <div className="property-section card">
      <h3 className="section-title">Additional details</h3>
      <div className="details-grid">
        <DetailItem label="Deposit" value={deposit} />
        <DetailItem
          label="Amenities"
          value={amenities.length > 0 ? amenities : "N/A"}
        />
        <DetailItem label="Pool Size" value={poolSize} />
        <DetailItem label="Additional Rooms" value={additionalRooms} />
        <DetailItem label="Last remodel year" value={lastRemodelYear} />
        <DetailItem label="Equipment" value={equipment} />
      </div>
    </div>
  );
};

export default AdditionalDetailsSection;
