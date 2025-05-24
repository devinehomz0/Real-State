// src/components/PropertyDetailsPage/ImageSection.js
import React, { useState } from "react";

const ImageSection = ({ imageUrls }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="image-section">
        <img
          src="https://via.placeholder.com/800x500?text=No+Image+Available"
          alt="Property"
        />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length
    );
  };

  // Placeholder image controls shown in design
  const showControls = true;

  return (
    <div className="image-section">
      <img
        src={imageUrls[currentImageIndex]}
        alt={`Property image ${currentImageIndex + 1}`}
        className="main-property-image"
      />
      {showControls && imageUrls.length > 1 && (
        <div className="image-controls-overlay">
          <button onClick={prevImage} className="img-nav-btn prev-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button onClick={nextImage} className="img-nav-btn next-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
         
        </div>
      )}
    </div>
  );
};

export default ImageSection;
