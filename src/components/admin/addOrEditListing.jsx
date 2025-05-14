// src/components/AddOrEditListing.js
import React, { useState, useEffect } from "react";
import { addDoc, updateDoc, collection, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import ImageUploader from "./imageUpload";

const initialForm = {
  title: "",
  type: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  status: "", // For Sale or For Rent
  price: "",
  negotiable: "no",
  bedrooms: "",
  bathrooms: "",
  area: "",
  parking: "no",
  outdoor: "no",
  features: "",
  description: "",
  bhk: "not_applicable",
  garage:"no",
};

function AddOrEditListing({ fetchListings, editingListing, clearEditing }) {
  const [form, setForm] = useState(initialForm);
  const [imageUrls, setImageUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingListing) {
      setForm({
        title: editingListing.title || "",
        type: editingListing.type || "",
        address: editingListing.address || "",
        city: editingListing.city || "",
        state: editingListing.state || "",
        zip: editingListing.zip || "",
        status: editingListing.status || "",
        price: editingListing.price || "",
        negotiable: editingListing.negotiable || "no",
        bedrooms: editingListing.bedrooms || "",
        bathrooms: editingListing.bathrooms || "",
        area: editingListing.area || "",
        parking: editingListing.parking || "no",
        outdoor: editingListing.outdoor || "no",
        features: editingListing.features
          ? Array.isArray(editingListing.features)
            ? editingListing.features.join(", ")
            : editingListing.features
          : "",
        description: editingListing.description || "",
        bhk: editingListing.bhk || "not_applicable",
        garage: editingListing.garage || "no",
      });
      setImageUrls(editingListing.imageUrls || []);
    } else {
      setForm(initialForm);
      setImageUrls([]);
    }
  }, [editingListing]);

  const handleUploadComplete = (urls) => {
    setImageUrls(urls);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    const requiredFields = [
      "title",
      "type",
      "address",
      "city",
      "state",
      "zip",
      "status",
      "price",
      "description",
    ];
    for (let field of requiredFields) {
      if (!form[field]) {
        alert("Please fill all required fields.");
        return;
      }
    }
    if (!imageUrls.length) {
      alert("Please upload at least one image.");
      return;
    }
    setSubmitting(true);

    const listingData = {
      ...form,
      price: Number(form.price),
      bedrooms: form.bedrooms ? Number(form.bedrooms) : "",
      bathrooms: form.bathrooms ? Number(form.bathrooms) : "",
      area: form.area ? Number(form.area) : "",
      imageUrls,
      features:
        typeof form.features === "string"
          ? form.features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
          : Array.isArray(form.features)
          ? form.features
          : [],
      updatedAt: new Date(),
    };

    if (editingListing) {
      await updateDoc(doc(db, "listings", editingListing.id), listingData);
      clearEditing();
    } else {
      await addDoc(collection(db, "listings"), {
        ...listingData,
        createdAt: new Date(),
      });
    }

    setForm(initialForm);
    setImageUrls([]);
    setSubmitting(false);
    fetchListings();
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <h2>{editingListing ? "Edit Listing" : "Create New Listing"}</h2>
      {/* Property Details */}
      <fieldset>
        <div className="one">
          {" "}
          <label>
            Property Title*:
            <br />
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Type of Property*:
            <br />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="single-family">Single Family Home</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Status*:
            <br />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              <option value="for sale">For Sale</option>
              <option value="for rent">For Rent</option>
            </select>
          </label>
        </div>
        <label>
          Property Address*:
          <br />
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>

        <div className="one">
          {" "}
          <label>
            City*:
            <br />
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            State*:
            <br />
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Zip Code*:
            <br />
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="one">
          {" "}
          <label>
            Listing Price*:
            <br />
            <input
              type="number"
              name="price"
              min="0"
              step="any"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Bedrooms:
            <br />
            <input
              type="number"
              name="bedrooms"
              min="0"
              value={form.bedrooms}
              onChange={handleChange}
            />
          </label>{" "}
          <label>
            Bathrooms:
            <br />
            <input
              type="number"
              name="bathrooms"
              min="0"
              value={form.bathrooms}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="one">
          {" "}
          <label>
            Features (comma separated)
            <br />
            <input
              type="text"
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder="e.g. Pool, Fireplace, Garden"
            />
          </label>
          <label>
            Total Area (sq ft):
            <br />
            <input
              type="number"
              name="area"
              min="0"
              step="any"
              value={form.area}
              onChange={handleChange}
            />
          </label>
          <label>
            BHK:
            <br />
            <select name="bhk" value={form.bhk} onChange={handleChange}>
              <option value="not_applicable">Not Applicable</option>
              <option value="1">1 BHK</option>
              <option value="1.5">1.5 BHK</option>
              <option value="2">2 BHK</option>
              <option value="2.5">2.5 BHK</option>
              <option value="3">3 BHK</option>
              <option value="3.5">3.5 BHK</option>
              <option value="4">4 BHK</option>
              <option value="4.5">4.5 BHK</option>
              <option value="5+">5+ BHK</option>
            </select>
          </label>
        </div>

        <div className="one">
          {" "}
          <label>
            Parking Available?:
            <br />
            <select name="parking" value={form.garage} onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Garage Available?:
            <br />
            <select name="parking" value={form.parking} onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Outdoor Space?:
            <br />
            <select name="outdoor" value={form.outdoor} onChange={handleChange}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
        </div>

        <div className="one">
          {" "}
          <label>
            Property Description*:
            <br />
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label>
          Property Images*:
          <br />
          <ImageUploader onUploadComplete={handleUploadComplete} />
        </label>
        <br />
        {imageUrls.length > 0 && (
          <div>
            <p>Uploaded Images:</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {imageUrls.map((url, idx) => (
                <img src={url} alt={`Uploaded ${idx}`} width={80} key={url} />
              ))}
            </div>
          </div>
        )}
        
        <button
        type="submit"
        disabled={
          submitting ||
          !form.title ||
          !form.type ||
          !form.address ||
          !form.city ||
          !form.state ||
          !form.zip ||
          !form.status ||
          !form.price ||
          !form.description ||
          !imageUrls.length
        }
      >
        {submitting
          ? editingListing
            ? "Updating..."
            : "Submitting..."
          : editingListing
          ? "Update Listing"
          : "Create Listing"}
      </button>
      {editingListing && (
        <button
          type="button"
          onClick={clearEditing}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      )}
      </fieldset>


      
    </form>
  );
}

export default AddOrEditListing;
