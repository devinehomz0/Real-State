// src/components/PropertyDetailsPage/FloorPlansSection.js
import React, {useState } from 'react';

const FloorPlanItem = ({ name, size, beds, baths, price }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="floor-plan-item">
            <div className="floor-plan-header" onClick={() => setIsOpen(!isOpen)}>
                <span><i className={`fas ${isOpen ? 'fa-chevron-down' : 'fa-chevron-right'}`}></i> {name}</span>
                <span className="floor-plan-summary">
                    Size: <strong>{size}</strong> <i className="fas fa-bed"></i> {beds} <i className="fas fa-bath"></i> {baths} Price: <strong>{price}</strong>
                </span>
            </div>
            {/*isOpen && (
                <div className="floor-plan-details-content">
                    Detailed content for {name} would go here (e.g., an image of the floor plan)
                    <img src="https://via.placeholder.com/600x300?text=Floor+Plan+Image" alt={`${name} plan`} />
                </div>
            )*/}
        </div>
    );
}

const FloorPlansSection = () => {
    // Static data as per image, since not in schema
    const floorPlansData = [
        { name: "First Floor", size: "1267 Sqft", beds: "670 Sqft", baths: "530 Sqft", price: "$1,650" }, // Note: Image seems to show bed/bath sizes, not counts
        { name: "Second Floor", size: "1345 Sqft", beds: "543 Sqft", baths: "238 Sqft", price: "$1,600" },
    ];

    return (
        <div className="property-section card">
            <h3 className="section-title">Floor Plans</h3>
            {floorPlansData.map((plan, index) => (
                <FloorPlanItem
                    key={index}
                    name={plan.name}
                    size={plan.size}
                    beds={plan.beds} // Or number of beds if available
                    baths={plan.baths} // Or number of baths if available
                    price={plan.price}
                />
            ))}
        </div>
    );
};

export default FloorPlansSection;