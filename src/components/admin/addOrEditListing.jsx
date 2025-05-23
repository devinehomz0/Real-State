import React, { useState, useEffect, useRef } from "react"; // Added useRef
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

// Helper to convert camelCase to Title Case
const camelToTitle = (camelCase) => {
  if (!camelCase) return "";
  const result = camelCase.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

function AddOrEditListing({ fetchListings, editingListing, clearEditing }) {
  const [form, setForm] = useState(initialForm);
  const [imageUrls, setImageUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorSummary, setShowErrorSummary] = useState(false); // New state for error summary
  const errorSummaryRef = useRef(null); // Ref for scrolling to error summary

  // Map field names to more readable display names for the summary
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
      // Add other specific names if needed, otherwise camelToTitle will be used
    };
    return names[fieldName] || camelToTitle(fieldName);
  };

  useEffect(() => {
    if (editingListing) {
      setForm({
        ...initialForm,
        ...editingListing,
        priceUnit: editingListing.priceUnit || "Lac",
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
    setShowErrorSummary(false); // Reset error summary visibility
  }, [editingListing]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Optionally hide summary when user starts correcting
    // if (showErrorSummary) setShowErrorSummary(false);
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // if (showErrorSummary) setShowErrorSummary(false);
  };

  const focusField = (fieldName) => {
    let elementToFocus = document.getElementById(fieldName);

    if (!elementToFocus) {
      // Try for button groups or special sections
      if (fieldName === "images") {
        elementToFocus = document.getElementById("image-upload-section");
      } else {
        elementToFocus = document.getElementById(`button-group-${fieldName}`);
      }
    }

    if (elementToFocus) {
      elementToFocus.focus({ preventScroll: true }); // Focus first
      elementToFocus.scrollIntoView({ behavior: "smooth", block: "center" });
      // For button groups, focus the first button if the group div itself isn't focusable by default
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
    setShowErrorSummary(false); // Reset first

    if (!validateForm()) {
      setShowErrorSummary(true);
      // Scroll to the error summary box if it's shown
      setTimeout(() => {
        // Timeout to ensure DOM update
        errorSummaryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
      return;
    }

    setSubmitting(true);
    const listingData = {
      /* ... same as before ... */ ...form,
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

    try {
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
      fetchListings();
      setErrors({});
      setShowErrorSummary(false);
    } catch (error) {
      console.error("Error submitting listing:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Failed to submit listing. Please try again.",
      }));
      setShowErrorSummary(true); // Show summary for backend/general errors too
    } finally {
      setSubmitting(false);
    }
  };

  const renderButtonGroup = (name, options) => (
    <div className="button-group" id={`button-group-${name}`} tabIndex={-1}>
      {" "}
      {/* Added id and tabIndex */}
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
      <h2>{editingListing ? "Edit Listing" : "Create New Listing"}</h2>

      {/* Error Summary Section */}
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
                message && field !== "form" ? ( // Exclude general form error from this list
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
        <label htmlFor="type">Type *</label>{" "}
        {/* Assuming renderButtonGroup uses 'type' as its name */}
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
        {" "}
        {/* Added id and tabIndex */}
        <label>Upload up to 20 Photos *</label>
        <ImageUploader
          onUploadComplete={handleUploadComplete}
          onUploading={handleImagesUploading}
          maxImages={20}
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
          (!editingListing && !imageUrls.length)
        } // Allow update even if images not changed
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
