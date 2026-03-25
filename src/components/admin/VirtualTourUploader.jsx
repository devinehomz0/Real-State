import React, { useState, useRef, useEffect } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

function VirtualTourUploader({
  onUploadComplete,
  onUploading,
  initialTour = [], // Expected: [{ id, name, imageUrl }]
}) {
  const [rooms, setRooms] = useState(initialTour);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [currentRoomName, setCurrentRoomName] = useState("");

  const cameraInputRef = useRef();
  const galleryInputRef = useRef();

  useEffect(() => {
    setRooms(initialTour || []);
  }, [initialTour]);

  const handleFileChange = async (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;

    if (!currentRoomName.trim()) {
      setError("Please enter a room name first (e.g. Living Room).");
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPG, JPEG, PNG, and WEBP images are allowed.");
      return;
    }

    setUploading(true);
    onUploading && onUploading(true);

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
        const newRoom = {
          id: Date.now().toString(),
          name: currentRoomName.trim(),
          imageUrl: data.secure_url
        };
        const updatedRooms = [...rooms, newRoom];
        setRooms(updatedRooms);
        onUploadComplete(updatedRooms);
        setShowModal(false);
        setCurrentRoomName("");
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      setError(`Failed to upload virtual tour: ${err.message}`);
    } finally {
      setUploading(false);
      onUploading && onUploading(false);
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const removeRoom = (id) => {
    const updatedRooms = rooms.filter(room => room.id !== id);
    setRooms(updatedRooms);
    onUploadComplete(updatedRooms);
  };

  return (
    <div className="virtual-tour-uploader">
      <div className="room-list" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
        {rooms.map((room) => (
          <div key={room.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={room.imageUrl} alt={room.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
              <span style={{ fontWeight: "600", color: "#374151" }}>{room.name}</span>
            </div>
            <button type="button" onClick={() => removeRoom(room.id)} style={{ padding: "6px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "4px", fontSize: "13px", cursor: "pointer" }}>Remove</button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#2e7d32",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {rooms.length > 0 ? "+ Add Another Room" : "Add 360 Degree Virtual Tour"}
      </button>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0 }}>Create 360° Node</h3>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Room / Area Name</label>
              <input 
                type="text" 
                placeholder="e.g. Master Bedroom, Hallway..." 
                value={currentRoomName}
                onChange={(e) => setCurrentRoomName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "10px" }}
              />
            </div>

            <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#555", marginBottom: "20px" }}>
              <strong>Capture Tip:</strong> Open your camera and switch to "Panorama" or "Sphere" mode. Capture the full 360 degrees around you.
            </p>

            {error && <div style={{ color: "red", marginBottom: "10px", fontSize: "13px" }}>{error}</div>}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ ...btnPrimaryStyle, opacity: !currentRoomName.trim() ? 0.5 : 1, cursor: !currentRoomName.trim() ? "not-allowed" : "pointer" }}>
                {uploading ? "Uploading..." : "📷 Open Camera"}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  ref={cameraInputRef}
                  disabled={uploading || !currentRoomName.trim()}
                  style={{ display: "none" }}
                />
              </label>

              <label style={{ ...btnSecondaryStyle, opacity: !currentRoomName.trim() ? 0.5 : 1, cursor: !currentRoomName.trim() ? "not-allowed" : "pointer" }}>
                {uploading ? "Uploading..." : "📁 Upload from Gallery"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={galleryInputRef}
                  disabled={uploading || !currentRoomName.trim()}
                  style={{ display: "none" }}
                />
              </label>

              <button 
                type="button" 
                onClick={() => { setShowModal(false); setCurrentRoomName(""); }}
                disabled={uploading}
                style={{ ...btnSecondaryStyle, background: "#f3f4f6", color: "#374151", borderColor: "#d1d5db" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center",
  zIndex: 1000, padding: "20px"
};

const modalContentStyle = {
  background: "white", padding: "25px", borderRadius: "12px",
  maxWidth: "400px", width: "100%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
};

const btnPrimaryStyle = {
  background: "#2563eb", color: "white", padding: "12px", borderRadius: "8px",
  textAlign: "center", fontWeight: "bold", display: "block", cursor: "pointer"
};

const btnSecondaryStyle = {
  background: "white", color: "#2563eb", border: "1px solid #2563eb",
  padding: "12px", borderRadius: "8px", textAlign: "center", fontWeight: "bold", display: "block", cursor: "pointer"
};

export default VirtualTourUploader;
