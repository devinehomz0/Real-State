// src/components/ListingsDisplay.js
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
  const displayYesNo = (val) => (val === "yes" ? "Yes" : "No");

  return (
    <div>
      <h2>All Listings</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
        {listings.map((listing) => (
          <div
            key={listing.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              width: "320px",
              background: "#fafafa",
              boxShadow: "0 1px 4px #eee",
            }}
          >
            {/* Images */}
            <div
              style={{
                display: "flex",
                gap: "5px",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {listing.imageUrls &&
                listing.imageUrls.map((url, idx) => (
                  <img
                    src={url}
                    alt={`Listing ${idx}`}
                    width={70}
                    key={url}
                    style={{ borderRadius: "4px" }}
                  />
                ))}
            </div>
            {/* Main Info */}
            <h3 style={{ margin: "0 0 4px 0" }}>{listing.title}</h3>
            <div style={{ fontSize: "0.95em", marginBottom: 8 }}>
              <b>Type:</b> {listing.type || "-"} &nbsp; | &nbsp;
              <b>Status:</b> {listing.status || "-"}
            </div>
            <div style={{ fontSize: "0.95em", marginBottom: 8 }}>
              <b>Address:</b> {listing.address}, {listing.city}, {listing.state}{" "}
              {listing.zip}
            </div>
            <div style={{ fontSize: "0.95em", marginBottom: 8 }}>
              <b>Price:</b> ₹{listing.price?.toLocaleString?.() || "-"} &nbsp;
            </div>
            <div style={{ fontSize: "0.95em", marginBottom: 8 }}>
              <b>BHK:</b>{" "}
              {listing.bhk && listing.bhk !== "not_applicable"
                ? listing.bhk
                : "-"}
              &nbsp; | &nbsp;
              <b>Bedrooms:</b> {listing.bedrooms || "-"}
              &nbsp; | &nbsp;
              <b>Bathrooms:</b> {listing.bathrooms || "-"}
            </div>
            <div style={{ fontSize: "0.95em", marginBottom: 8 }}>
              <b>Total Area:</b> {listing.area ? `${listing.area} sq ft` : "-"}
            </div>
            <div style={{ fontSize: "0.95em", marginBottom: 8 }}>
              <b>Parking:</b> {displayYesNo(listing.parking)}
              &nbsp; | &nbsp;
              <b>Garage:</b> {displayYesNo(listing.garage)}
              &nbsp; | &nbsp;
              <b>Outdoor Space:</b> {displayYesNo(listing.outdoor)}
            </div>
            <div style={{ fontSize: "0.95em", marginBottom: 8 }}>
              <b>Features:</b>{" "}
              {Array.isArray(listing.features)
                ? listing.features.join(", ")
                : listing.features || "-"}
            </div>
            <div style={{ fontSize: "0.95em", marginBottom: 8 }}>
              <b>Description:</b>
              <br />
              <span style={{ whiteSpace: "pre-line" }}>
                {listing.description}
              </span>
            </div>
            {/* Actions */}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => onEdit(listing)}>Edit</button>
              <button
                onClick={() => handleDelete(listing.id)}
                style={{ marginLeft: "8px", color: "red" }}
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
