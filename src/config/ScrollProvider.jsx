// src/contexts/ScrollContext.js
import  { createContext, useContext, useRef } from "react";

const ScrollContext = createContext(null); // Initialize with null or a default shape

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};

export const ScrollProvider = ({ children }) => {
  const contactSectionRef = useRef(null); // This ref will point to the contact section in Footer

  const scrollToContact = (
    options = { behavior: "smooth", block: "start" }
  ) => {
    if (contactSectionRef.current) {
      // Optional: Adjust for fixed navbar height
      const navbarHeight = 70; // Estimate or get dynamically
      const elementPosition =
        contactSectionRef.current.getBoundingClientRect().top +
        window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      // window.scrollTo({
      //   top: offsetPosition,
      //   behavior: options.behavior,
      // });
      // OR simply:
      contactSectionRef.current.scrollIntoView(options);
    } else {
      console.warn(
        "Contact section ref is not yet available. Ensure Footer is rendered."
      );
    }
  };

  // Value provided by the context
  const value = {
    contactSectionRef, // The ref itself (Footer will assign to this)
    scrollToContact, // The function to trigger scrolling (Navbar will call this)
  };

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};
