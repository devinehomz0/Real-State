import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

const VirtualTour = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // virtualTour is expected to be: [{ id, name, imageUrl }]
  const virtualTour = location.state?.virtualTour || [];
  
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // If there's only one image in state.imageUrl (legacy), convert it
  useEffect(() => {
    if (virtualTour.length === 0 && location.state?.imageUrl) {
      // Handle legacy single-image state if needed
    }
  }, [virtualTour, location.state]);

  if (!virtualTour.length && !location.state?.imageUrl) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>No 360° Tour found for this property.</h2>
        <button 
          onClick={() => navigate(-1)}
          style={{ padding: "10px 20px", background: "#e5e7eb", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentRoom = virtualTour[currentRoomIndex] || { imageUrl: location.state?.imageUrl, name: "Property View" };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", margin: 0, padding: 0, overflow: "hidden" }}>
      {/* Top Header */}
      <div style={{ 
        position: "absolute", 
        top: 0, left: 0, right: 0, 
        zIndex: 10, 
        padding: "15px 20px", 
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pointerEvents: "none"
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            pointerEvents: "auto",
            padding: "8px 16px", 
            background: "white", 
            color: "#333", 
            border: "none", 
            borderRadius: "6px", 
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px"
          }}
        >
          ← Exit Tour
        </button>
        <div style={{ color: "white", textAlign: "right" }}>
          <h2 style={{ margin: 0, fontSize: "18px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{currentRoom.name}</h2>
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>360° Virtual Experience</p>
        </div>
      </div>

      {/* Room Navigation Menu */}
      {virtualTour.length > 1 && (
        <div style={{ 
          position: "absolute", 
          bottom: "30px", 
          left: "50%", 
          transform: "translateX(-50%)", 
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px"
        }}>
          {isMenuOpen && (
            <div style={{ 
              background: "rgba(255,255,255,0.95)", 
              borderRadius: "12px", 
              padding: "10px", 
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              maxWidth: "90vw",
              marginBottom: "10px"
            }}>
              {virtualTour.map((room, idx) => (
                <button 
                  key={room.id}
                  onClick={() => { setCurrentRoomIndex(idx); setIsMenuOpen(false); }}
                  style={{
                    flexShrink: 0,
                    width: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: "5px",
                    borderRadius: "8px",
                    backgroundColor: currentRoomIndex === idx ? "#f3f4f6" : "transparent"
                  }}
                >
                  <img src={room.imageUrl} alt={room.name} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px", border: currentRoomIndex === idx ? "2px solid #2e7d32" : "1px solid #ddd" }} />
                  <span style={{ fontSize: "10px", fontWeight: "bold", color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>{room.name}</span>
                </button>
              ))}
            </div>
          )}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ 
              padding: "12px 24px", 
              background: "#2e7d32", 
              color: "white", 
              border: "none", 
              borderRadius: "30px", 
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(46, 125, 50, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {isMenuOpen ? "Close Menu" : "Switch Room"} 📍
          </button>
        </div>
      )}

      <ReactPhotoSphereViewer 
        src={currentRoom.imageUrl} 
        height={"100vh"} 
        width={"100%"} 
        defaultZoomLvl={50}
        loadingTxt="Moving to next room..."
        key={currentRoom.imageUrl} // Forces re-mount for smooth reload of new room
      />
    </div>
  );
};

export default VirtualTour;
