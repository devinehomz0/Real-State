// src/components/AddOrEditListing.js
import React, { useState, useEffect } from "react";
import { addDoc, updateDoc, collection, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import ImageUploader from "./imageUpload";

function AddOrEditListing({ fetchListings, editingListing, clearEditing }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingListing) {
      setTitle(editingListing.title);
      setDescription(editingListing.description);
      setImageUrls(editingListing.imageUrls || []);
    } else {
      setTitle("");
      setDescription("");
      setImageUrls([]);
    }
  }, [editingListing]);

  const handleUploadComplete = (urls) => {
    setImageUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !imageUrls.length) {
      alert("Please fill all fields and upload images.");
      return;
    }
    setSubmitting(true);

    if (editingListing) {
      await updateDoc(doc(db, "listings", editingListing.id), {
        title,
        description,
        imageUrls,
        updatedAt: new Date(),
      });
      clearEditing();
    } else {
      await addDoc(collection(db, "listings"), {
        title,
        description,
        imageUrls,
        createdAt: new Date(),
      });
    }

    setTitle("");
    setDescription("");
    setImageUrls([]);
    setSubmitting(false);
    fetchListings();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingListing ? "Edit Listing" : "Create New Listing"}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Listing Title"
        required
      />
      <br />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Listing Description"
        required
      />
      <br />
      <ImageUploader onUploadComplete={handleUploadComplete} />
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
      <br />
      <button
        type="submit"
        disabled={submitting || !title || !description || !imageUrls.length}
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
