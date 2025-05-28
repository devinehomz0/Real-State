import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase"; // Adjust path to your firebase config
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,query
} from "firebase/firestore";
import { FaTrash, FaSearch } from "react-icons/fa"; // For icons
import "../styles/Inquiries.css"; // Your existing CSS

// Helper to format Firestore Timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  // Assuming timestamp is a Firestore Timestamp object
  const date = timestamp.toDate();
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: '2-digit', // Optional: include seconds
    // timeZoneName: 'short' // Optional: include timezone
  });
};

function Inquiries() {
  const [allInquiries, setAllInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // For filtering by status (if applicable)

  // Fetch inquiries from Firestore
  useEffect(() => {
    const fetchInquiriesData = async () => {
      setLoading(true);
      try {
        const inquiriesCollectionRef = collection(db, "enquirys");
        // Order by createdAt descending to show newest first
        const q = query(inquiriesCollectionRef, orderBy("createdAt", "desc"));
        const data = await getDocs(q);
        const fetchedInquiries = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAllInquiries(fetchedInquiries);
        setFilteredInquiries(fetchedInquiries); // Initialize filtered list
        console.log("Fetched inquiries:", fetchedInquiries);
      } catch (error) {
        console.error("Error fetching inquiries: ", error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setLoading(false);
      }
    };

    fetchInquiriesData();
  }, []);

  // Handle client-side filtering
  useEffect(() => {
    let result = allInquiries;

    // Filter by search term
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (inquiry) =>
          (inquiry.name &&
            inquiry.name.toLowerCase().includes(lowercasedSearchTerm)) ||
          (inquiry.email &&
            inquiry.email.toLowerCase().includes(lowercasedSearchTerm)) ||
          (inquiry.phone &&
            inquiry.phone.toLowerCase().includes(lowercasedSearchTerm)) ||
          (inquiry.message &&
            inquiry.message.toLowerCase().includes(lowercasedSearchTerm)) ||
          (inquiry.description &&
            inquiry.description.toLowerCase().includes(lowercasedSearchTerm)) ||
          (inquiry.propertyTitle &&
            inquiry.propertyTitle
              .toLowerCase()
              .includes(lowercasedSearchTerm)) ||
          (inquiry.contact &&
            inquiry.contact.toLowerCase().includes(lowercasedSearchTerm)) // For the 'contact' type inquiry
      );
    }

    // Filter by status (if you add a status field to all inquiries)
    // For now, the mock data had status, but your Firestore structure doesn't seem to universally.
    // If you decide to add a status field to all Firestore inquiries, you can uncomment and adapt this.
    /*
    if (selectedStatus) {
      result = result.filter(inquiry =>
        inquiry.status && inquiry.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }
    */

    setFilteredInquiries(result);
  }, [searchTerm, selectedStatus, allInquiries]);

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) {
      return;
    }
    try {
      const inquiryDocRef = doc(db, "enquirys", inquiryId);
      let deleter = await deleteDoc(inquiryDocRef);
      console.log(deleter)
      // Update local state to reflect deletion
      setAllInquiries((prevInquiries) =>
        prevInquiries.filter((inq) => inq.id !== inquiryId)
      );
      alert("Inquiry deleted successfully.");
    } catch (error) {
      console.error("Error deleting inquiry: ", error);
      alert("Failed to delete inquiry.");
    }
  };

  if (loading) {
    return <div className="inquiries-loading">Loading inquiries...</div>;
  }

  return (
    <div className="inquiries">
      <div className="inquiries-header-container">
        {" "}
        {/* Changed class name for clarity */}
        <div>
          <h2>Inquiries</h2>
          <p>Manage customer inquiries</p>
        </div>
      </div>

      <div className="inquiries-search-bar">
        {" "}
        {/* Changed class name */}
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
       
      </div>

      {filteredInquiries.length === 0 && !loading && (
        <p className="no-inquiries-found">No inquiries found.</p>
      )}

      <div className="inquiries-grid">
        {filteredInquiries.map((inquiry) => (
          <div key={inquiry.id} className="inquiry-card">
            <div className="inquiry-card-header">
              {" "}
              {/* Changed class name */}
              <h3>{inquiry.name || "N/A"}</h3>
              {/* Display a type or status if available. Your Firestore example doesn't have a consistent status. */}
              {inquiry.type && (
                <span
                  className={`status-badge status-${inquiry.type
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  Type: {inquiry.type}
                </span>
              )}
            </div>
            <div className="inquiry-content">
              <p className="inquiry-contact">
                {inquiry.email && (
                  <span>
                    <strong>Email:</strong> {inquiry.email}
                  </span>
                )}
                {inquiry.phone && (
                  <span>
                    <strong>Phone:</strong> {inquiry.phone}
                  </span>
                )}
                {inquiry.contact && !inquiry.email && !inquiry.phone && (
                  <span>
                    <strong>Contact Info:</strong> {inquiry.contact}
                  </span>
                )}
              </p>

              {/* Conditional rendering based on inquiry type */}
              {/* Type 1: Has 'message' and 'propertyTitle' */}
              {inquiry.message && inquiry.propertyTitle && (
                <>
                  <div className="inquiry-message">
                    <h4>Message</h4>
                    <p>{inquiry.message}</p>
                  </div>
                  <div className="inquiry-property">
                    <h4>Regarding Property</h4>
                    <p>{inquiry.propertyTitle}</p>
                  </div>
                  {inquiry.preference && (
                    <p>
                      <strong>Preferred Contact:</strong> {inquiry.preference}
                    </p>
                  )}
                </>
              )}

              {/* Type 2: Has 'description' (acting as message) and 'type' (e.g., 'tennant') */}
              {inquiry.description && inquiry.type && (
                <>
                  <div className="inquiry-message">
                    <h4>Inquiry Details ({inquiry.type})</h4>
                    <p>{inquiry.description}</p>
                  </div>
                </>
              )}

              <div className="inquiry-footer">
                <span className="inquiry-date">
                  <strong>Received:</strong>{" "}
                  {formatTimestamp(inquiry.createdAt)}
                </span>
                <div className="inquiry-actions">
                  {/* <button className="btn btn-primary btn-small">View Details</button> */}
                  <button
                    onClick={() => handleDeleteInquiry(inquiry.id)}
                    className="btn btn-danger btn-small" // Added btn-small for consistency
                    aria-label="Delete Inquiry"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inquiries;
