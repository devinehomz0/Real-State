import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Properties from "./components/admin/Properties";
import Inquiries from "./components/admin/Inquiries";
import CreateProperty from "./components/admin/CreateProperty";
import AdminMain from "./components/admin/admin";
import HomePage from "./pages/Home";
import AllListings from "./pages/Listings";
import PropertyDetails from "./pages/IndivPages/PropertyDetails";
// Sample data matching your schema
const samplePropertyData = {
  address: "knh",
  bathrooms: 3,
  bedrooms: 3,
  bhk: "3",
  carParking: "1",
  carpetArea: 6544,
  city: "fff",
  createdAt: { seconds: 1747724044, nanoseconds: 0 }, // Example timestamp
  description:
    "This is a beautiful property with stunning views and modern amenities. Located in a prime area, it offers comfort and luxury. The spacious layout is perfect for families. Enjoy the convenience of nearby shops, restaurants, and parks. Don't miss this opportunity!",
  facing: "East",
  features: ["Clubhouse", "Gym", "Swimming Pool", "Security"],
  floorNo: 5,
  furnishing: "Unfurnished",
  garage: "no", // Note: carParking="1" is used for the garage count in Overview
  imageUrls: [
    "https://via.placeholder.com/800x500/ADD8E6/000000?Text=Property+Image+1",
    "https://via.placeholder.com/800x500/90EE90/000000?Text=Property+Image+2",
    "https://via.placeholder.com/800x500/FFB6C1/000000?Text=Property+Image+3",
  ],
  listedBy: "Builder",
  maintenance: 4158,
  negotiable: "no",
  outdoor: "yes",
  price: 876000, // Example price to match image
  projectName: "trail",
  projectStatus: "Ready to Move",
  state: "ma",
  status: "For Sale",
  superBuiltupArea: 2560, // Example SqFt to match image
  title: "Penthouse Apartment",
  totalFloors: 15,
  type: "Flats / Apartments",
  updatedAt: { seconds: 1747724044, nanoseconds: 0 }, // Example timestamp
  zip: "123455",
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/adminnew/*" element={<Admin />}>
          <Route index element={<Properties />} />
          <Route path="properties" element={<Properties />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="create-property" element={<CreateProperty />} />
        </Route>
        <Route path="/admin" element={<AdminMain></AdminMain>}></Route>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route
          path="/alllistings"
          element={<AllListings></AllListings>}
        ></Route>
        <Route
          path="/listing/"
          element={<PropertyDetails></PropertyDetails>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
