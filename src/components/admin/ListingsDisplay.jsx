import { db } from "../../config/firebase";
import { deleteDoc, doc } from "firebase/firestore";

function ListingsDisplay({ listings, onEdit, fetchListings }) {
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this listing? This action cannot be undone."
      )
    ) {
      await deleteDoc(doc(db, "listings", id));
      fetchListings();
    }
  };

  // Helper to display Yes/No fields
  const displayYesNo = (val) =>
    val === "yes" ? "Yes" : val === "no" ? "No" : val || "-";

  // Helper to show a field only if it exists
  const Field = ({ label, value, strong, suffix }) =>
    value !== undefined &&
    value !== "" &&
    value !== null &&
    value !== "not_applicable" ? (
      <div className="listing-field">
        <span className="listing-label">{label}</span>
        {strong ? <b>{value}</b> : value}
        {suffix || ""}
      </div>
    ) : null;

  return (
    <div>
      <h2 style={{ margin: "18px 0 24px 0" }}>All Listings</h2>
      <div className="listings-grid">
        {listings.map((listing) => (
          <div className="listing-card" key={listing.id}>
            {/* Images */}
            {listing.imageUrls && listing.imageUrls.length > 0 && (
              <div className="listing-images">
                {listing.imageUrls.slice(0, 5).map((url, idx) => (
                  <img
                    src={url}
                    alt={`Listing ${idx}`}
                    className="listing-thumb"
                    key={url}
                  />
                ))}
                {listing.imageUrls.length > 5 && (
                  <span className="more-images">
                    +{listing.imageUrls.length - 5}
                  </span>
                )}
              </div>
            )}

            <div className="listing-content">
              <div className="listing-header">
                <h3>{listing.title}</h3>
                <div className="listing-type-status">
                  {Field({
                    label: "",
                    value: listing.type,
                  })}
                  {listing.type && listing.status && <span> | </span>}
                  {Field({
                    label: "",
                    value: listing.status,
                  })}
                </div>
              </div>
              {/* Project Name */}
              {Field({
                label: "Project:",
                value: listing.projectName,
              })}
              {/* Address */}
              {Field({
                label: "Address:",
                value: [
                  listing.address,
                  listing.city,
                  listing.state,
                  listing.zip,
                ]
                  .filter(Boolean)
                  .join(", "),
              })}
              {/* Price */}
              {Field({
                label: "Price:",
                value: listing.price
                  ? `₹${Number(listing.price).toLocaleString()}`
                  : "-", // If price is not set, display "-"
                strong: true,
                suffix:
                  listing.price && listing.priceUnit
                    ? ` ${listing.priceUnit}`
                    : "", // Add priceUnit as suffix if price and unit exist
              })}

              {/* BHK, Bedrooms, Bathrooms */}
              <div className="listing-row">
                {Field({
                  label: "BHK:",
                  value: listing.bhk,
                })}
                {Field({
                  label: "Bedrooms:",
                  value: listing.bedrooms,
                })}
                {Field({
                  label: "Bathrooms:",
                  value: listing.bathrooms,
                })}
              </div>
              {/* Super Builtup Area, Carpet Area */}
              <div className="listing-row">
                {Field({
                  label: "Super Builtup Area:",
                  value: listing.superBuiltupArea
                    ? `${listing.superBuiltupArea} sq ft`
                    : undefined,
                })}
                {Field({
                  label: "Carpet Area:",
                  value: listing.carpetArea
                    ? `${listing.carpetArea} sq ft`
                    : undefined,
                })}
                {Field({
                  label: "Maintenance:",
                  value: listing.maintenance
                    ? `₹${listing.maintenance}/mo`
                    : undefined,
                })}
              </div>
              {/* Floor Details */}
              <div className="listing-row">
                {Field({
                  label: "Total Floors:",
                  value: listing.totalFloors,
                })}
                {Field({
                  label: "Floor No:",
                  value: listing.floorNo,
                })}
                {Field({
                  label: "Car Parking:",
                  value: listing.carParking,
                })}
              </div>
              {/* Facing, Furnishing, Project Status, Listed By */}
              <div className="listing-row">
                {Field({
                  label: "Facing:",
                  value: listing.facing,
                })}
                {Field({
                  label: "Furnishing:",
                  value: listing.furnishing,
                })}
                {Field({
                  label: "Project Status:",
                  value: listing.projectStatus,
                })}
                {Field({
                  label: "Listed By:",
                  value: listing.listedBy,
                })}
              </div>
              {/* Garage, Outdoor, Features */}
              <div className="listing-row">
                {Field({
                  label: "Garage:",
                  value: displayYesNo(listing.garage),
                })}
                {Field({
                  label: "Outdoor Space:",
                  value: displayYesNo(listing.outdoor),
                })}
                {Field({
                  label: "Features:",
                  value: Array.isArray(listing.features)
                    ? listing.features.join(", ")
                    : listing.features,
                })}
              </div>
              {/* Description */}
              {Field({
                label: "Description:",
                value: (
                  <span style={{ whiteSpace: "pre-line" }}>
                    {listing.description}
                  </span>
                ),
              })}
            </div>
            {/* Actions (uncomment if needed) */}
            <div className="listing-actions">
              <button onClick={() => onEdit(listing)} className="edit">
                Edit
              </button>
              <button
                onClick={() => handleDelete(listing.id)}
                className="delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingsDisplay;
