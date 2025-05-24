// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../config/AuthContext";

function ProtectedRoute({ children }) {
  const { currentUser, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    // You can return a loading spinner or null while auth state is being determined
    return <div>Loading authentication status...</div>; // Or a proper spinner component
  }

  if (!currentUser) {
    // User not authenticated, redirect to login page
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the children (the protected component)
  return children;
}

export default ProtectedRoute;
