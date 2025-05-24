// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./components/admin/admin"; // Your Admin layout component
import Properties from "./components/admin/Properties"; // Example admin page
import Inquiries from "./components/admin/Inquiries"; // Example admin page
import CreateProperty from "./components/admin/CreateProperty"; // Example admin page
import AdminMain from "./pages/Admin"; // Your existing AdminMain
import HomePage from "./pages/Home";
import AllListings from "./pages/Listings";
import PropertyDetails from "./pages/IndivPages/PropertyDetails";
import LoginPage from "./pages/LoginPage"; // Import the LoginPage
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
// Ensure paths for Properties, Inquiries, CreateProperty etc are correct based on your folder structure

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Admin Routes */}
        <Route
       path="/admin/*"
          element={
            <ProtectedRoute>
                   <AdminMain />
            </ProtectedRoute>
          }
        >
          {/* Nested routes will inherit protection if Admin is the layout */}
          {/* Make sure these components are correctly placed within Admin's <Outlet /> */}
          <Route index element={<Properties />} /> {/* Default for /adminnew */}
          <Route path="properties" element={<Properties />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="create-property" element={<CreateProperty />} />
          {/* Add other /adminnew nested routes here if needed */}
        </Route>

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Potentially another admin route, protect it if needed */}
        <Route
            path="/adminnew" 
          element={
            <ProtectedRoute>
              {" "}
              {/* Or however you want to handle AdminMain */}
         <Admin />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/alllistings" element={<AllListings />} />
        <Route path="/listing/" element={<PropertyDetails />} />

        {/* You might want a catch-all or 404 route */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
