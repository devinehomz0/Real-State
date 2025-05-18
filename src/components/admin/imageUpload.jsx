import { useState, useRef, useEffect } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_IMAGES = 20;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

function ImageUploader({
  onUploadComplete,
  onUploading,
  maxImages = MAX_IMAGES,
  resetKey,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    setSelectedFiles([]);
    setPreviews([]);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }, [resetKey]);

  const handleFileChange = (e) => {
    setError("");
    const files = Array.from(e.target.files);

    if (files.length + selectedFiles.length > maxImages) {
      setError(`You can upload up to ${maxImages} images.`);
      setSelectedFiles([]);
      setPreviews([]);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    for (let file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Only JPG, JPEG, PNG, and WEBP images are allowed.");
        setSelectedFiles([]);
        setPreviews([]);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    setSelectedFiles(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleUploadImages = async () => {
    setError("");
    if (!selectedFiles.length) {
      setError("Please select images to upload.");
      return;
    }
    setUploading(true);
    onUploading && onUploading(true);

    const urls = [];
    for (const file of selectedFiles) {
      try {
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
        } else {
          throw new Error(data.error?.message || "Upload failed");
        }
      } catch (err) {
        setError(`Failed to upload "${file.name}": ${err.message}`);
        setUploading(false);
        onUploading && onUploading(false);
        setSelectedFiles([]);
        setPreviews([]);
        if (inputRef.current) inputRef.current.value = "";
        onUploadComplete([]);
        return;
      }
    }

    setUploading(false);
    onUploading && onUploading(false);
    setSelectedFiles([]);
    setPreviews([]);
    if (inputRef.current) inputRef.current.value = "";
    onUploadComplete(urls);
  };

  const handleRemoveImage = (idx) => {
    const newFiles = selectedFiles.filter((_, i) => i !== idx);
    const newPreviews = previews.filter((_, i) => i !== idx);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    if (inputRef.current && newFiles.length === 0) inputRef.current.value = "";
  };

  return (
    <div className="image-uploader-ui">
      <div className="image-uploader-controls">
        <label className="choose-files-btn">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: "none" }}
          />
          Choose Images
        </label>
        <button
          type="button"
          className="upload-images-btn"
          onClick={handleUploadImages}
          disabled={uploading || !selectedFiles.length}
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="image-preview-list">
        {previews.map((src, idx) => (
          <div className="img-preview" key={src}>
            <img src={src} alt="" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              title="Remove image"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="img-count">
        {selectedFiles.length} / {maxImages} images selected
      </div>
    </div>
  );
}

export default ImageUploader;
