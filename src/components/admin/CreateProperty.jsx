import { useState } from "react"; // useState is not used here, can be removed if not needed for other things
import { Link } from "react-router-dom";
import "../styles/CreateProperty.css";
import { useLocation } from "react-router-dom";
import AddOrEditListing from "./addOrEditListing"; // Ensure path is correct

function CreateProperty() {
  const location = useLocation();
  const propertyData = location.state?.listing; // This is the `listing` prop for AddOrEditListing

  // This console log is fine for debugging
  if (propertyData) {
    console.log("CreateProperty received listing data:", propertyData);
  } else {
    console.log("CreateProperty: No listing data received, creating new.");
  }

  return (
    <div className="create-property">
      <div className="page-header">
        <Link to="/admin/properties" className="back-link">
          ← Back
        </Link>
        {/* Title can be dynamic based on propertyData */}
        <h2>{propertyData ? "Edit Property" : "Create New Property"}</h2>
      </div>
      {/* Pass propertyData as the 'listing' prop */}
      <AddOrEditListing listing={propertyData} />
    </div>
  );
}

export default CreateProperty;
