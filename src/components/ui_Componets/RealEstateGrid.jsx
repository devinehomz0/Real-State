import React from "react";
import apartmentImg from "../../assets/d1.jpg";
import officeImg from "../../assets/d2.jpg";
import studioImg from "../../assets/d3.jpg";
import singleFamilyImg from "../../assets/download.jpg";
import shopImg from "../../assets/d4.jpg";
import villaImg from "../../assets/d5.jpg";
import "../styles/RealStateGrid.css";

// Your grid data
const gridData = [
  { title: "Apartment", properties: 17, image: apartmentImg },
  { title: "Office", properties: 8, image: officeImg },
  { title: "Studio", properties: 7, image: studioImg },
  { title: "Single Family Home", properties: 10, image: singleFamilyImg },
  { title: "Shop", properties: 3, image: shopImg },
  { title: "Villa", properties: 10, image: villaImg },
];

// GridCard Component
function GridCard({ title, properties, image, className }) {
  return (
    <div
      className={`re-card ${className || ""}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="re-card-overlay" />
      <div className="re-card-content">
        <div className="re-card-properties">{properties} Properties</div>
        <div className="re-card-title">{title}</div>
        <div className="re-card-details">
          MORE DETAILS <span className="re-card-arrow">▶</span>
        </div>
      </div>
    </div>
  );
}

export default function RealEstateGrid() {
  return (
    <div className="re-grid-wrapper">
      <div className="re-grid-left">
        <h2>Explore Properties Tailored for You</h2>
        <p>
          From modern apartments to spacious villas, our listings help you find
          a place you’ll love to call home or grow your business.
        </p>
      </div>
      <div className="re-grid-right">
        <div className="re-grid">
          <div className="re-grid-col">
            {/* Studio - Tallest */}
            <GridCard {...gridData[2]} className="re-card-span-3" />
          </div>
          <div className="re-grid-col">
            {/* Apartment - Regular */}
            <GridCard {...gridData[0]} />
            {/* Single Family Home - Regular */}
            <GridCard {...gridData[3]} />
            {/* Shop - Regular */}
            <GridCard {...gridData[4]} />
          </div>
          <div className="re-grid-col">
            {/* Office - Medium Tall */}
            <GridCard {...gridData[1]} className="re-card-span-2" />
            {/* Villa - Regular */}
            <GridCard {...gridData[5]} />
          </div>
        </div>
      </div>
    </div>
  );
}
