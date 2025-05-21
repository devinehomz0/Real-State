// src/index.js or src/App.js (where your main App component is rendered)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ScrollProvider } from "../src/config/ScrollProvider"; // Adjust path
import "./index.css"; // Your global styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ScrollProvider>
      {" "}
      {/* Wrap your App */}
      <App />
    </ScrollProvider>
  </React.StrictMode>
);
