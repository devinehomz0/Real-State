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
  status: "",
  price: "",
  negotiable: "no",
  bedrooms: "",
  bathrooms: "",
  outdoor: "",
  features: "",
  description: "",
  bhk: "",
  garage: "",
  superBuiltupArea: "",
  carpetArea: "",
  maintenance: "",
  totalFloors: "",
  floorNo: "",
  carParking: "",
  furnishing: "",
  projectStatus: "",
  listedBy: "",
  facing: "",
  projectName: "",
};

const typeOptions = [
  "Flats / Apartments",
  "Independent / Builder Floors",
  "Farm House",
  "House & Villa",
];
const bhkOptions = ["1", "2", "3", "4", "4+"];
const bathroomOptions = ["1", "2", "3", "4", "4+"];
const bedroomOptions = ["1", "2", "3", "4", "4+"];
const furnishingOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
const projectStatusOptions = [
  "New Launch",
  "Ready to Move",
  "Under Construction",
];
const listedByOptions = ["Builder", "Dealer", "Owner"];
const carParkingOptions = ["0", "1", "2", "3", "3+"];
const facingOptions = [
  "East",
  "North",
  "North-East",
  "North-West",
  "South",
  "South-East",
  "South-West",
  "West",
];
const statusOptions = ["For Sale", "For Rent"];

function AddOrEditListing({ fetchListings, editingListing, clearEditing }) {
  const [form, setForm] = useState(initialForm);
  const [imageUrls, setImageUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingListing) {
      setForm({
        ...initialForm,
        ...editingListing,
        features: editingListing.features
          ? Array.isArray(editingListing.features)
            ? editingListing.features.join(", ")
            : editingListing.features
          : "",
      });
      setImageUrls(editingListing.imageUrls || []);
    } else {
      setForm(initialForm);
      setImageUrls([]);
    }
    setErrors({});
  }, [editingListing]);

  // Image uploader handlers
  const handleUploadComplete = (urls) => {
    setImageUrls(urls);
    setImagesUploading(false);
  };

  const handleImagesUploading = (uploading) => {
    setImagesUploading(uploading);
  };

  // Validation helpers
  const validateField = (name, value) => {
    switch (name) {
      case "title":
      case "address":
      case "city":
      case "state":
      case "status":
      case "description":
      case "type":
      case "bhk":
      case "bedrooms":
      case "bathrooms":
      case "furnishing":
      case "projectStatus":
      case "listedBy":
        if (!value || value === "") return "This field is required";
        break;
      case "price":
        if (!value || value === "") return "This field is required";
        if (isNaN(value) || Number(value) <= 0)
          return "Enter a valid positive price";
        break;
      case "zip":
        if (!value || value === "") return "This field is required";
        if (!/^\d{5,10}$/.test(value))
          return "Enter a valid zip code (5-10 digits)";
        break;
      case "superBuiltupArea":
      case "carpetArea":
        if (!value || value === "") return "This field is required";
        if (isNaN(value) || Number(value) <= 0)
          return "Enter a valid positive number";
        break;
      default:
        return "";
    }
    return "";
  };

  const validateForm = () => {
    let newErrors = {};
    Object.keys(initialForm).forEach((key) => {
      // Only validate required fields
      if (
        [
          "title",
          "type",
          "address",
          "city",
          "state",
          "zip",
          "status",
          "price",
          "description",
          "bhk",
          "bedrooms",
          "bathrooms",
          "furnishing",
          "projectStatus",
          "listedBy",
          "superBuiltupArea",
          "carpetArea",
        ].includes(key)
      ) {
        const err = validateField(key, form[key]);
        if (err) newErrors[key] = err;
      }
    });
    if (!imageUrls.length) {
      newErrors.images = "Please upload at least one image";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const listingData = {
      ...form,
      price: Number(form.price),
      bedrooms: form.bedrooms ? Number(form.bedrooms) : "",
      bathrooms: form.bathrooms ? Number(form.bathrooms) : "",
      superBuiltupArea: form.superBuiltupArea
        ? Number(form.superBuiltupArea)
        : "",
      carpetArea: form.carpetArea ? Number(form.carpetArea) : "",
      maintenance: form.maintenance ? Number(form.maintenance) : "",
      totalFloors: form.totalFloors ? Number(form.totalFloors) : "",
      floorNo: form.floorNo ? Number(form.floorNo) : "",
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
    setErrors({});
  };

  // Button group renderer
  const renderButtonGroup = (name, options) => (
    <div className="button-group">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className={
            form[name] === option ? "btn-select selected" : "btn-select"
          }
          onClick={() => handleSelect(name, option)}
        >
          {option}
        </button>
      ))}
      {errors[name] && <div className="form-error">{errors[name]}</div>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <h2>Create New Listing</h2>
      {/* Type */}
      <div className="form-section">
        <label>Type *</label>
        {renderButtonGroup("type", typeOptions)}
      </div>
      {/* BHK, Bedrooms, Bathrooms */}
      <div className="form-row">
        <div>
          <label>BHK *</label>
          {renderButtonGroup("bhk", bhkOptions)}
        </div>
        <div>
          <label>Bedrooms *</label>
          {renderButtonGroup("bedrooms", bedroomOptions)}
        </div>
        <div>
          <label>Bathrooms *</label>
          {renderButtonGroup("bathrooms", bathroomOptions)}
        </div>
      </div>
      {/* Furnishing, Project Status, Listed By */}
      <div className="form-row">
        <div>
          <label>Furnishing *</label>
          {renderButtonGroup("furnishing", furnishingOptions)}
        </div>
        <div>
          <label>Project Status *</label>
          {renderButtonGroup("projectStatus", projectStatusOptions)}
        </div>
        <div>
          <label>Listed By *</label>
          {renderButtonGroup("listedBy", listedByOptions)}
        </div>
      </div>
      {/* Super Builtup Area, Carpet Area */}
      <div className="form-row">
        <div>
          <label>Super Builtup Area (sqft) *</label>
          <input
            type="number"
            name="superBuiltupArea"
            value={form.superBuiltupArea}
            onChange={handleChange}
            required
          />
          {errors.superBuiltupArea && (
            <div className="form-error">{errors.superBuiltupArea}</div>
          )}
        </div>
        <div>
          <label>Carpet Area (sqft) *</label>
          <input
            type="number"
            name="carpetArea"
            value={form.carpetArea}
            onChange={handleChange}
            required
          />
          {errors.carpetArea && (
            <div className="form-error">{errors.carpetArea}</div>
          )}
        </div>{" "}
        <div>
          <label>Facing</label>
          <select name="facing" value={form.facing} onChange={handleChange}>
            <option value="">Select</option>
            {facingOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Maintenance, Total Floors, Floor No */}
      <div className="form-row">
        <div>
          <label>Maintenance (Monthly)</label>
          <input
            type="number"
            name="maintenance"
            value={form.maintenance}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Total Floors</label>
          <input
            type="number"
            name="totalFloors"
            value={form.totalFloors}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Floor No</label>
          <input
            type="number"
            name="floorNo"
            value={form.floorNo}
            onChange={handleChange}
          />
        </div>
      </div>
      {/* Car Parking, Facing */}
      <div className="form-row">
        <div>
          <label>Car Parking</label>
          {renderButtonGroup("carParking", carParkingOptions)}
        </div>

        <div>
          <label>Project Name</label>
          <input
            type="text"
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            maxLength={70}
          />
        </div>
        <div>
          <label>Title </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={70}
            required
          />
          <div className="char-count">{form.title.length} / 70</div>
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>
      </div>
      {/* Description */}
      <div className="form-section">
        <label>Description </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          maxLength={4096}
          required
        />
        <div className="char-count">{form.description.length} / 4096</div>
        {errors.description && (
          <div className="form-error">{errors.description}</div>
        )}
      </div>
      {/* Address, City, State, Zip, Status, Features, Garage, Outdoor */}
      <div className="form-row">
        <div>
          <label>Address *</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
          {errors.address && <div className="form-error">{errors.address}</div>}
        </div>
        <div>
          <label>City *</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
          {errors.city && <div className="form-error">{errors.city}</div>}
        </div>
        <div>
          <label>State *</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          />
          {errors.state && <div className="form-error">{errors.state}</div>}
        </div>
        <div>
          <label>Zip *</label>
          <input
            type="text"
            name="zip"
            value={form.zip}
            onChange={handleChange}
            required
          />
          {errors.zip && <div className="form-error">{errors.zip}</div>}
        </div>
      </div>
      <div className="form-row">
        <div>
          <label>Status *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="">Select status</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.status && <div className="form-error">{errors.status}</div>}
        </div>
        <div>
          <label>Features (comma separated)</label>
          <input
            type="text"
            name="features"
            value={form.features}
            onChange={handleChange}
            placeholder="e.g. Pool, Fireplace, Garden"
          />
        </div>
        <div>
          <label>Garage Available?</label>
          <select name="garage" value={form.garage} onChange={handleChange}>
            <option value="">Select</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <label>Outdoor Space?</label>
          <select name="outdoor" value={form.outdoor} onChange={handleChange}>
            <option value="">Select</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>
      {/* Price */}
      <div className="form-section">
        <label>Set a Price *</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
        {errors.price && <div className="form-error">{errors.price}</div>}
      </div>
      {/* Image Upload */}
      <div className="form-section">
        <label>Upload up to 20 Photos</label>
        <ImageUploader
          onUploadComplete={handleUploadComplete}
          onUploading={handleImagesUploading}
          maxImages={20}
        />
        {imageUrls.length > 0 && (
          <div className="uploaded-images">
            {imageUrls.map((url, idx) => (
              <img src={url} alt={`Uploaded ${idx}`} key={url} width={80} />
            ))}
          </div>
        )}
        {errors.images && <div className="form-error">{errors.images}</div>}
      </div>
      {/* Submit */}
      <button
        type="submit"
        className="submit-btn"
        disabled={submitting || imagesUploading || !imageUrls.length}
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
        <button type="button" className="cancel-btn" onClick={clearEditing}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default AddOrEditListing;

/* Add this to your CSS:
.form-error {
  color: #d32f2f;
  font-size: 13px;
  margin-top: 3px;
}
*/
