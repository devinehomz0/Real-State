// src/components/PropertyDetailsPage/DetailsSection.js
import React from "react";
import { FaRupeeSign } from "react-icons/fa";


const DetailsSection = ({
  data,
  propertyId,
  price,
  propertySize,
  bedrooms,
  bathrooms,
  garage,
  garageSize,
  yearBuilt,
  propertyType,
  propertyStatus,
  updatedAt,
}) => {
  // Create an array of details
  const details = [
    { label: "Garage", value: data?.garage },
    { label: "Car Parking", value: data?.carParking },
    { label: "Carpet Area", value: `${data?.carpetArea} Sq Ft` },
    {
      label: "Price",
      value: data.price ? (
        <>
          <FaRupeeSign /> {data.price} {data.priceUnit}
        </>
      ) : undefined,
    },
    { label: "Property Size", value: propertySize },
    { label: "Bedrooms", value: bedrooms },
    { label: "Property Type", value: propertyType },
    { label: "Bathrooms", value: bathrooms },
    { label: "Property Status", value: propertyStatus },
    { label: "Furnishing", value: data?.furnishing },
    { label: "Floor No", value: data?.floorNo },
    {
      label: "Maintenance",
      value: data?.maintenance ? (
        <>
          <FaRupeeSign /> {data.maintenance}/per month
        </>
      ) : undefined,
    },
    { label: "Facing", value: data?.facing },
    { label: "Total Floors", value: data?.totalFloors },
    {label:"BHK",value:data?.bhk}
  ];
  const DetailItem = ({ label, value }) => (
    <div className="detail-item">
      <span className="detail-label">{label}:</span>
      <span className="detail-value">{value}</span>
    </div>
  );
  
  return (
    <div className="property-section card">
      <div className="section-header-flex">
        <h3 className="section-title">Details</h3>
      </div>
      <div className="details-grid">
        {details
          .filter(
            (detail) =>
              detail.value !== undefined &&
              detail.value !== null &&
              detail.value !== ""&& detail.value!=="no"
          )
          .map((detail, idx) => (
            <DetailItem
              key={detail.label + idx}
              label={detail.label}
              value={detail.value}
            />
          ))}
      </div>
    </div>
  );
};
  

export default DetailsSection;
