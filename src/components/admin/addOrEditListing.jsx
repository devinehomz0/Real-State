// src/components/AddOrEditListing.js
import React, { useState, useEffect } from "react";
import { addDoc, updateDoc, collection, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import ImageUploader from "./imageUpload";

const initialForm = {
  title: "",
  type: "",
  address: "",
  price: "",
  listingDate: "",
  availabilityDate: "",
  negotiable: "no",
  bedrooms: "",
  bathrooms: "",
  area: "",
  parking: "no",
  outdoor: "no",
  features: "",
  description: "",
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
        price: editingListing.price || "",
        listingDate: editingListing.listingDate || "",
        availabilityDate: editingListing.availabilityDate || "",
        negotiable: editingListing.negotiable || "no",
        bedrooms: editingListing.bedrooms || "",
        bathrooms: editingListing.bathrooms || "",
        area: editingListing.area || "",
        parking: editingListing.parking || "no",
        outdoor: editingListing.outdoor || "no",
        features: editingListing.features || "",
        description: editingListing.description || "",
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
      "price",
      "listingDate",
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
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
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
        <legend>Property Details</legend>
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
        <br />
        <br />

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
            <option value="condo">Condominium</option>
            <option value="townhouse">Townhouse</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
            <option value="other">Other</option>
          </select>
        </label>
        <br />
        <br />

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
        <br />
        <br />

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
        <br />
        <br />

        <label>
          Listing Date*:
          <br />
          <input
            type="date"
            name="listingDate"
            value={form.listingDate}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <br />

        <label>
          Availability Date:
          <br />
          <input
            type="date"
            name="availabilityDate"
            value={form.availabilityDate}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />

        <label>
          Is Price Negotiable?:
          <br />
          <select
            name="negotiable"
            value={form.negotiable}
            onChange={handleChange}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <br />
        <br />

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
        </label>
        <br />
        <br />

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
        <br />
        <br />

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
        <br />
        <br />

        <label>
          Parking Available?:
          <br />
          <select name="parking" value={form.parking} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <br />
        <br />

        <label>
          Outdoor Space?:
          <br />
          <select name="outdoor" value={form.outdoor} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <br />
        <br />

        <label>
          Property Features (comma separated):
          <br />
          <input
            type="text"
            name="features"
            value={form.features}
            onChange={handleChange}
            placeholder="e.g. Pool, Fireplace, Garden"
          />
        </label>
        <br />
        <br />

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
        <br />
        <br />

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
      </fieldset>

      <br />

      <button
        type="submit"
        disabled={
          submitting ||
          !form.title ||
          !form.type ||
          !form.address ||
          !form.price ||
          !form.listingDate ||
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
    </form>
  );
}

export default AddOrEditListing;
