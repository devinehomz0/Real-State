// src/index.js or src/App.js (where your main App component is rendered)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ScrollProvider } from "../src/config/ScrollProvider"; // Adjust path
import "./index.css"; // Your global styles
import { AuthProvider } from "./config/AuthContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ScrollProvider>
        <App />
      </ScrollProvider>
    </AuthProvider>
  </React.StrictMode>
);
