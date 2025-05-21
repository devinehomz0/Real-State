import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"; // adjust the path to your firebase.js
import "../components/styles/home.css"
import Hero from "../components/ui_Componets/Hero";
import Features from "../components/ui_Componets/features";
import HorizontalListing from "../components/ui_Componets/horizontalListing";
import RealEstateGrid from "../components/ui_Componets/RealEstateGrid";
import EnquiryForm from "../components/ui_Componets/EnquiryForm";
import Footer from "../components/ui_Componets/Footer";
import DevineHomzLoader from "../components/ui_Componets/Loader";
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


  if (loading) {
    return <DevineHomzLoader isLoading={true} />;
  }
  return (
    <div>
      <Hero></Hero>
      <Features></Features>
      <HorizontalListing listing={listings}></HorizontalListing>
      <RealEstateGrid></RealEstateGrid>
      <EnquiryForm></EnquiryForm>
      <Footer></Footer>      
    </div>
  );
};

export default HomePage;
