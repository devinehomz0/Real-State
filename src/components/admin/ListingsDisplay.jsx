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
              width: "260px",
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
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
            <h3 className="h3">{listing.title}</h3>
            <p className="p">{listing.description}</p>
            <button onClick={() => onEdit(listing)}>Edit</button>
            <button
              onClick={() => handleDelete(listing.id)}
              style={{ marginLeft: "8px", color: "red" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingsDisplay;
