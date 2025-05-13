import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firebase"; // adjust the path to your firebase.js

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all listings from Firestore
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "listings")); // "listings" is your collection name
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>All Listings</h2>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id}>
            <strong>{listing.title}</strong> - {listing.description}
            {/* Add more fields as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
