import { useEffect,useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import AddOrEditListing from "./addOrEditListing";
import ListingsDisplay from "./ListingsDisplay";
import "../styles/admin.css"
function AdminMain() {
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);

  const fetchListings = async () => {
    const querySnapshot = await getDocs(collection(db, "listings"));
    setListings(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };
  useEffect(() => {
    fetchListings();
  }, []);
  const handleEdit = (listing) => {
    setEditingListing(listing);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearEditing = () => setEditingListing(null);
  return (
    <>
      {" "}
      <AddOrEditListing
        fetchListings={fetchListings}
        editingListing={editingListing}
        clearEditing={clearEditing}
      />
      <hr />
      <ListingsDisplay
        listings={listings}
        onEdit={handleEdit}
        fetchListings={fetchListings}
      />
    </>
  );
}

export default AdminMain;
