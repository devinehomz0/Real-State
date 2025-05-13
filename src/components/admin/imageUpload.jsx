// src/components/ImageUploader.js
import { useState } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;



function ImageUploader({ onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUploadImages = async () => {
    if (!selectedFiles.length) {
      alert("Please select images to upload.");
      return;
    }
    setUploading(true);
    const urls = [];
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        urls.push(data.secure_url);
      }
    }
    setUploading(false);
    setSelectedFiles([]);
    onUploadComplete(urls);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button
        type="button"
        onClick={handleUploadImages}
        disabled={uploading || !selectedFiles.length}
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
}

export default ImageUploader;
