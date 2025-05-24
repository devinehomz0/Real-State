// src/components/PropertyDetailsPage/DescriptionSection.js
import React from "react";

const DescriptionSection = ({ description }) => {
  return (
    <div className="property-section card">
      <h3 className="section-title">Description</h3>
      <p className="description-text">{description}</p>
    </div>
  );
};

export default DescriptionSection;
