// src/components/PropertyDetailsPage/PropertyDetailsPage.js
import React from "react";
import PropertyHeader from "./PropertyHeader";
import ImageSection from "./ImageSection";
import ContactForm from "./ContactForm";
import OverviewSection from "./OverviewSection";
import DescriptionSection from "./DescriptionSection";
import DetailsSection from "./DetailsSection";
import AdditionalDetailsSection from "./AdditionalDetailsSection";
import AddressSection from "./AddressSection";
import FloorPlansSection from "./FloorPlansSection";
import "../../components/styles/PropertyDetails.css";
import Navbar from "../../components/ui_Componets/navbar";
import Footer from "../../components/ui_Componets/Footer";
import { useLocation,useNavigate } from "react-router-dom";
import PanaromicView from "../../components/ui_Componets/PAnoromicView";

// Helper to format price
const formatPrice = (price) => {
  if (price === undefined || price === null) return "N/A";
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const PropertyDetailsPage = () => {
    const location = useLocation();
    const navigate=useNavigate()
  const propertyData = location.state?.listing;
  if (!propertyData) {
    return <div>Loading property details...</div>;
  }
  console.log(propertyData);
  const pricePerSqFt =
    propertyData.price && propertyData.superBuiltupArea
      ? (propertyData.price / propertyData.superBuiltupArea).toFixed(2)
      : "N/A";

  // Using placeholder agent details as they are not in the schema

  // Placeholder data for sections where schema data is missing but shown in UI
  const placeholderDetails = {
    propertyId: "hz-HZ43",
    yearBuilt: "2016", // From image, not in schema
    garageSize: "200 SqFt", // From image, not in schema
    deposit: "20%", // From image, not in schema
    poolSize: "300 SqFt", // From image, not in schema
    lastRemodelYear: "1987", // From image, not in schema
    additionalRooms: "Guest Bath", // From image, not in schema
    equipment: "Grill - Gas", // From image, not in schema
    area: "Brooklyn", // From image, not in schema
    country: "India", // From image, not in schema
  };

  return (
    <div className="indiv">
      <Navbar></Navbar>{" "}
      <button onClick={() => navigate(-1)} className="back_indiv">
        ← Back
      </button>
      <div className="property-details-container">
        <PropertyHeader
          title={propertyData.title || "Penthouse Apartment"}
          price={propertyData.price}
          priceUnit={propertyData.priceUnit}
          address={`${propertyData.address || ""}, ${
            propertyData.city || ""
          }, ${propertyData.state || ""}, ${placeholderDetails.country}`}
          status={propertyData.status || "For Sale"}
          isFeatured={true} // Assuming featured, not in schema
        />

        <div className="property-main-content">
          <div className="property-left-column">
            <ImageSection imageUrls={propertyData.imageUrls} className="imageSection"/>
            <OverviewSection
              propertyType={propertyData.type || "N/A"}
              bedrooms={propertyData.bedrooms || 0}
              bathrooms={propertyData.bathrooms || 0}
              garage={propertyData.garage || "0"}
              sqFt={propertyData.superBuiltupArea || 0}
              yearBuilt={placeholderDetails.yearBuilt}
              mapImageUrl="https://via.placeholder.com/400x250?text=Map+Placeholder" // Placeholder for map
            />
            <DescriptionSection
              description={
                propertyData.description || "No description available."
              }
            />
            <DetailsSection
              data={propertyData}
              propertyId={placeholderDetails.propertyId}
              price={formatPrice(propertyData.price)}
              propertySize={`${propertyData.superBuiltupArea || "N/A"} Sq Ft`}
              bedrooms={propertyData.bedrooms || 0}
              bathrooms={propertyData.bathrooms || 0}
              garage={propertyData.carParking || "0"}
              garageSize={placeholderDetails.garageSize}
              yearBuilt={placeholderDetails.yearBuilt}
              propertyType={propertyData.type || "N/A"}
              propertyStatus={propertyData.status || "N/A"}
              updatedAt={
                propertyData.updatedAt
                  ? new Date(
                      propertyData.updatedAt.seconds * 1000
                    ).toLocaleDateString()
                  : "N/A"
              }
            />
  {/* <PanaromicView></PanaromicView> */}
            <AddressSection
              address={propertyData.address || "N/A"}
              city={propertyData.city || "N/A"}
              stateCounty={propertyData.state || "N/A"}
              zipPostalCode={propertyData.zip || "N/A"}
              area={placeholderDetails.area}
              country={placeholderDetails.country}
            />
            {/* <FloorPlansSection /> */}
          </div>
          <div className="property-right-column">
            <ContactForm
              propertyTitle={propertyData.title || "this apartment"}
            />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default PropertyDetailsPage;
