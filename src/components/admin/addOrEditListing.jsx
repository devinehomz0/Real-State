import React, { useState, useEffect, useRef } from "react";
import { addDoc, updateDoc, collection, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import ImageUploader from "./imageUpload";
import { useNavigate } from "react-router-dom";
const initialForm = {
  title: "",
  type: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  status: "",
  price: "",
  priceUnit: "Lac",
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

// ... (typeOptions, bhkOptions, etc. remain the same) ...
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
const priceUnitOptions = ["Lac", "Crore"];

const camelToTitle = (camelCase) => {
  if (!camelCase) return "";
  const result = camelCase.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

function AddOrEditListing({
  listing,
  fetchListings,
  editingListing,
  clearEditing,
}) {
  const [form, setForm] = useState(initialForm);
  const [imageUrls, setImageUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorSummary, setShowErrorSummary] = useState(false);
  const errorSummaryRef = useRef(null);
let navigate = useNavigate();
  const getFieldDisplayName = (fieldName) => {
    const names = {
      title: "Title",
      type: "Type",
      address: "Address",
      city: "City",
      state: "State",
      zip: "Zip Code",
      status: "Status",
      price: "Price",
      priceUnit: "Price Unit",
      description: "Description",
      bhk: "BHK",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      furnishing: "Furnishing",
      projectStatus: "Project Status",
      listedBy: "Listed By",
      superBuiltupArea: "Super Builtup Area",
      carpetArea: "Carpet Area",
      images: "Images",
    };
    return names[fieldName] || camelToTitle(fieldName);
  };

  useEffect(() => {
    // Determine if we are in "edit" mode.
    // `editingListing` is for when this component is used in a context where an "edit" button is clicked within the same page.
    // `listing` (passed from CreateProperty) is for when the component is loaded on a dedicated edit page.
    const dataToEdit = editingListing || listing;

    if (dataToEdit) {
      console.log("Populating form with:", dataToEdit);
      setForm({
        ...initialForm, // Start with defaults to ensure all fields are present
        ...dataToEdit, // Spread the data to edit
        priceUnit: dataToEdit.priceUnit || "Lac", // Ensure default if not present
        features: dataToEdit.features
          ? Array.isArray(dataToEdit.features)
            ? dataToEdit.features.join(", ") // Convert array to string for input
            : dataToEdit.features
          : "",
      });
      setImageUrls(dataToEdit.imageUrls || []);
    } else {
      // Reset to initial state for "create new" mode
      setForm(initialForm);
      setImageUrls([]);
    }
    setErrors({}); // Always reset errors when the listing to edit changes or goes away
    setShowErrorSummary(false);
  }, [editingListing, listing]); // Re-run this effect if `editingListing` or `listing` prop changes

  // ... (handleUploadComplete, handleImagesUploading, validateField, validateForm, handleChange, handleSelect, focusField, handleSubmit, renderButtonGroup functions remain the same) ...
  const handleUploadComplete = (urls) => {
    setImageUrls(urls);
    setImagesUploading(false);
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handleImagesUploading = (uploading) => {
    setImagesUploading(uploading);
  };

  const validateField = (name, value) => {
    // ... (validation logic remains the same)
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
      case "priceUnit":
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
    const requiredFields = [
      "title",
      "type",
      "address",
      "city",
      "state",
      "zip",
      "status",
      "price",
      "priceUnit",
      "description",
      "bhk",
      "bedrooms",
      "bathrooms",
      "furnishing",
      "projectStatus",
      "listedBy",
      "superBuiltupArea",
      "carpetArea",
    ];

    Object.keys(initialForm).forEach((key) => {
      if (
        requiredFields.includes(key) ||
        key === "zip" ||
        key === "superBuiltupArea" ||
        key === "carpetArea"
      ) {
        // Ensure form[key] exists before validating, especially for optional fields not in initialForm
        const err = validateField(
          key,
          form[key] !== undefined ? form[key] : ""
        );
        if (err) newErrors[key] = err;
      }
    });

    if (!imageUrls.length) {
      newErrors.images = "Please upload at least one image";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const focusField = (fieldName) => {
    let elementToFocus = document.getElementById(fieldName);
    if (!elementToFocus) {
      if (fieldName === "images") {
        elementToFocus = document.getElementById("image-upload-section");
      } else {
        elementToFocus = document.getElementById(`button-group-${fieldName}`);
      }
    }
    if (elementToFocus) {
      elementToFocus.focus({ preventScroll: true });
      elementToFocus.scrollIntoView({ behavior: "smooth", block: "center" });
      if (
        elementToFocus.classList.contains("button-group") ||
        elementToFocus.id === "image-upload-section"
      ) {
        const firstButton = elementToFocus.querySelector(
          "button, input, select, textarea"
        );
        if (firstButton) firstButton.focus({ preventScroll: true });
      }
    } else {
      console.warn(`Could not find element to focus for field: ${fieldName}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrorSummary(false);

    if (!validateForm()) {
      setShowErrorSummary(true);
      setTimeout(() => {
        errorSummaryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
      return;
    }

    setSubmitting(true);

    // Helper function to safely process these values
    const processNumericPlusField = (value) => {
      if (typeof value === "string" && value.includes("+")) {
        return Number(value.replace("+", ""));
      }
      if (value === "" || value === null || value === undefined) {
        return ""; // Or handle as needed, e.g., null for Firestore
      }
      return Number(value); // Ensure it's a number if it wasn't a "plus" string
    };

    const listingData = {
      ...form,
      price: form.price ? Number(form.price) : "", // Ensure price is also handled if empty
      bedrooms: processNumericPlusField(form.bedrooms),
      bathrooms: processNumericPlusField(form.bathrooms),
      bhk:
        typeof form.bhk === "string" && form.bhk.includes("+")
          ? form.bhk.replace("+", "")
          : form.bhk
          ? String(form.bhk)
          : "", // BHK might be stored as string '1', '2', '3', '4', '4+'
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

    // ... (rest of handleSubmit)
    const isNewListing = !editingListing && !listing;

    try {
      if (editingListing || listing) {
        const idToUpdate = editingListing
          ? editingListing.id
          : listing
          ? listing.id
          : null;
        if (!idToUpdate) {
          throw new Error("No ID found for updating the listing.");
        }
        await updateDoc(doc(db, "listings", idToUpdate), listingData);
        if (clearEditing) clearEditing();
      } else {
        await addDoc(collection(db, "listings"), {
          ...listingData,
          createdAt: new Date(),
        });
      }
      setForm(initialForm);
      setImageUrls([]);
      if (fetchListings) fetchListings();
      setErrors({});
      setShowErrorSummary(false);
    } catch (error) {
      console.error("Error submitting listing:", error);
      setErrors((prev) => ({
        ...prev,
        form: `Failed to submit listing. ${error.message}`,
      }));
      setShowErrorSummary(true);
    } finally {
      setSubmitting(false);
      navigate("/admin");
    }
  };
  const renderButtonGroup = (name, options) => (
    <div className="button-group" id={`button-group-${name}`} tabIndex={-1}>
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
      <h2>
        {editingListing || listing ? "Edit Listing" : "Create New Listing"}
      </h2>

      {showErrorSummary &&
        Object.keys(errors).filter((key) => errors[key] && key !== "form")
          .length > 0 && (
          <div
            ref={errorSummaryRef}
            className="form-error-summary"
            role="alert"
            style={{
              border: "1px solid #d32f2f",
              padding: "10px 15px",
              marginBottom: "20px",
              backgroundColor: "#ffebee",
            }}
          >
            <h4 style={{ marginTop: 0, color: "#d32f2f" }}>
              Please correct the following errors:
            </h4>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              {Object.entries(errors).map(([field, message]) =>
                message && field !== "form" ? (
                  <li key={field} style={{ marginBottom: "5px" }}>
                    <button
                      type="button"
                      onClick={() => focusField(field)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#1976d2",
                        textDecoration: "underline",
                        cursor: "pointer",
                        padding: 0,
                        textAlign: "left",
                      }}
                    >
                      {getFieldDisplayName(field)}
                    </button>
                    : {message}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      {errors.form && (
        <div
          className="form-error"
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {errors.form}
        </div>
      )}

      {/* Type */}
      <div className="form-section">
        <label htmlFor="type">Type *</label>
        {renderButtonGroup("type", typeOptions)}
      </div>
      {/* BHK, Bedrooms, Bathrooms */}
      <div className="form-row">
        <div>
          <label htmlFor="bhk">BHK *</label>
          {renderButtonGroup("bhk", bhkOptions)}
        </div>
        <div>
          <label htmlFor="bedrooms">Bedrooms *</label>
          {renderButtonGroup("bedrooms", bedroomOptions)}
        </div>
        <div>
          <label htmlFor="bathrooms">Bathrooms *</label>
          {renderButtonGroup("bathrooms", bathroomOptions)}
        </div>
      </div>
      {/* Furnishing, Project Status, Listed By */}
      <div className="form-row">
        <div>
          <label htmlFor="furnishing">Furnishing *</label>
          {renderButtonGroup("furnishing", furnishingOptions)}
        </div>
        <div>
          <label htmlFor="projectStatus">Project Status *</label>
          {renderButtonGroup("projectStatus", projectStatusOptions)}
        </div>
        <div>
          <label htmlFor="listedBy">Listed By *</label>
          {renderButtonGroup("listedBy", listedByOptions)}
        </div>
      </div>
      {/* Super Builtup Area, Carpet Area, Facing */}
      <div className="form-row">
        <div>
          <label htmlFor="superBuiltupArea">Super Builtup Area (sqft) *</label>
          <input
            type="number"
            name="superBuiltupArea"
            id="superBuiltupArea"
            value={form.superBuiltupArea}
            onChange={handleChange}
          />
          {errors.superBuiltupArea && (
            <div className="form-error">{errors.superBuiltupArea}</div>
          )}
        </div>
        <div>
          <label htmlFor="carpetArea">Carpet Area (sqft) *</label>
          <input
            type="number"
            name="carpetArea"
            id="carpetArea"
            value={form.carpetArea}
            onChange={handleChange}
          />
          {errors.carpetArea && (
            <div className="form-error">{errors.carpetArea}</div>
          )}
        </div>
        <div>
          <label htmlFor="facing">Facing</label>
          <select
            name="facing"
            id="facing"
            value={form.facing}
            onChange={handleChange}
          >
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
          <label htmlFor="maintenance">Maintenance (Monthly)</label>
          <input
            type="number"
            name="maintenance"
            id="maintenance"
            value={form.maintenance}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="totalFloors">Total Floors</label>
          <input
            type="number"
            name="totalFloors"
            id="totalFloors"
            value={form.totalFloors}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="floorNo">Floor No</label>
          <input
            type="number"
            name="floorNo"
            id="floorNo"
            value={form.floorNo}
            onChange={handleChange}
          />
        </div>
      </div>
      {/* Car Parking, Project Name, Title */}
      <div className="form-row">
        <div>
          <label htmlFor="carParking">Car Parking</label>
          {renderButtonGroup("carParking", carParkingOptions)}
        </div>
        <div>
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            name="projectName"
            id="projectName"
            value={form.projectName}
            onChange={handleChange}
            maxLength={70}
          />
        </div>
        <div>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            name="title"
            id="title"
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
        <label htmlFor="description">Description *</label>
        <textarea
          name="description"
          id="description"
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
      {/* Address, City, State, Zip */}
      <div className="form-row">
        <div>
          <label htmlFor="address">Address *</label>
          <input
            type="text"
            name="address"
            id="address"
            value={form.address}
            onChange={handleChange}
            required
          />
          {errors.address && <div className="form-error">{errors.address}</div>}
        </div>
        <div>
          <label htmlFor="city">City *</label>
          <input
            type="text"
            name="city"
            id="city"
            value={form.city}
            onChange={handleChange}
            required
          />
          {errors.city && <div className="form-error">{errors.city}</div>}
        </div>
        <div>
          <label htmlFor="state">State *</label>
          <input
            type="text"
            name="state"
            id="state"
            value={form.state}
            onChange={handleChange}
            required
          />
          {errors.state && <div className="form-error">{errors.state}</div>}
        </div>
        <div>
          <label htmlFor="zip">Zip *</label>
          <input
            type="text"
            name="zip"
            id="zip"
            value={form.zip}
            onChange={handleChange}
            required
          />
          {errors.zip && <div className="form-error">{errors.zip}</div>}
        </div>
      </div>
      {/* Status, Features, Garage, Outdoor */}
      <div className="form-row">
        <div>
          <label htmlFor="status">Status *</label>
          {renderButtonGroup("status", statusOptions)}
        </div>
        <div>
          <label htmlFor="features">Features (comma separated)</label>
          <input
            type="text"
            name="features"
            id="features"
            value={form.features}
            onChange={handleChange}
            placeholder="e.g. Pool, Fireplace, Garden"
          />
        </div>
        <div>
          <label htmlFor="garage">Garage Available?</label>
          <select
            name="garage"
            id="garage"
            value={form.garage}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <label htmlFor="outdoor">Outdoor Space?</label>
          <select
            name="outdoor"
            id="outdoor"
            value={form.outdoor}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>
      {/* Price & Price Unit */}
      <div className="form-section">
        <label>Set a Price *</label>
        <div
          className="price-input-group"
          style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
        >
          <div style={{ flexGrow: 1 }}>
            <input
              type="number"
              name="price"
              id="price"
              value={form.price}
              onChange={handleChange}
              style={{ width: "100%" }}
              step="any"
              required
            />
            {errors.price && !errors.priceUnit && (
              <div className="form-error" style={{ marginTop: "0px" }}>
                {errors.price}
              </div>
            )}
          </div>
          {renderButtonGroup("priceUnit", priceUnitOptions)}
        </div>
      </div>
      {/* Image Upload */}
      <div className="form-section" id="image-upload-section" tabIndex={-1}>
        <label>Upload up to 20 Photos *</label>
        <ImageUploader
          onUploadComplete={handleUploadComplete}
          onUploading={handleImagesUploading}
          maxImages={20}
          initialImageUrls={imageUrls}
        />
        {imageUrls.length > 0 && (
          <div
            className="uploaded-images"
            style={{
              marginTop: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {imageUrls.map((url, idx) => (
              <img
                src={url}
                alt={`Uploaded ${idx + 1}`}
                key={idx}
                width={80}
                height={80}
                style={{ objectFit: "cover" }}
              />
            ))}
          </div>
        )}
        {errors.images && <div className="form-error">{errors.images}</div>}
      </div>
      {/* Submit */}
      <button
        type="submit"
        className="submit-btn"
        disabled={
          submitting ||
          imagesUploading ||
          (!editingListing && !listing && !imageUrls.length)
        }
      >
        {submitting
          ? editingListing || listing
            ? "Updating..."
            : "Submitting..."
          : editingListing || listing
          ? "Update Listing"
          : "Create Listing"}
      </button>
      {editingListing &&
        clearEditing && ( // Only show cancel if it's a modal-like edit with clearEditing prop
          <button
            type="button"
            className="cancel-btn"
            onClick={clearEditing}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
    </form>
  );
}

export default AddOrEditListing;
