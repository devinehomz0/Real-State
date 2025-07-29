import React, { useEffect, useState } from "react";
import { collection, getDocs ,limit,query} from "firebase/firestore";
import { db } from "../config/firebase"; // adjust the path to your firebase.js
import "../components/styles/home.css"
import Hero from "../components/ui_Componets/Hero";
import Features from "../components/ui_Componets/features";
import HorizontalListing from "../components/ui_Componets/horizontalListing";
import RealEstateGrid from "../components/ui_Componets/RealEstateGrid";
import EnquiryForm from "../components/ui_Componets/EnquiryForm";
import Footer from "../components/ui_Componets/Footer";
import DevineHomzLoader from "../components/ui_Componets/Loader";
import PartnersShowcase from "../components/ui_Componets/Partners";
const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all listings from Firestore
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Create a query with a limit of 8
        const listingsQuery = query(collection(db, "listings"), limit(8));
        const querySnapshot = await getDocs(listingsQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(data);
        console.log(data);
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
      {!loading && <HorizontalListing listings={listings}></HorizontalListing>}
      <RealEstateGrid></RealEstateGrid>
      <PartnersShowcase></PartnersShowcase>
      <EnquiryForm></EnquiryForm>
      <Footer></Footer>      
    </div>
  );
};

export default HomePage;
