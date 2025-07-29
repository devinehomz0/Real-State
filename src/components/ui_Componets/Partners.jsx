import React from "react";
import "../styles/Partners.css";
import hdfc from "../../assets/logos/hdfc.png";
import sbi from "../../assets/logos/sbi.png";
import axis from "../../assets/logos/axis.jpg";
import insta from "../../assets/logos/insta.webp";
import face from "../../assets/logos/facebook.webp";
import yt from "../../assets/logos/youtube.webp";
import link from "../../assets/logos/linkdin.jpg";

const PartnersShowcase = () => {
  // Banking partners data
  const bankingPartners = [
    { name: "Axis Bank", logo: axis },
    { name: "HDFC Bank", logo: hdfc },
    { name: "SBI", logo: sbi },
  ];

  // Marketing partners data
  const marketingPartners = [
    { name: "Instagram", logo: insta },
    { name: "Linkedin", logo: link},
    { name: "YouTube", logo: yt },
    { name: "Facebook", logo: face },
  ];

  // Create multiple duplicates for seamless loop
  const createDuplicatedLogos = (partners, prefix) => {
    const duplicates = [];
    // Create 4 sets to ensure seamless scrolling
    for (let i = 0; i < 4; i++) {
      partners.forEach((partner, index) => {
        duplicates.push(
          <div key={`${prefix}-${i}-${index}`} className="partner-logo">
            <img src={partner.logo} alt={partner.name} />
          </div>
        );
      });
    }
    return duplicates;
  };

  return (
    <div className="partners-showcase">
      <div className="partners-section">
        <h2 className="section-title">Banking Partners</h2>
        <div className="partners-container">
          <div className="partners-scroll">
            {createDuplicatedLogos(bankingPartners, "banking")}
          </div>
        </div>
      </div>

      <div className="partners-section">
        <h2 className="section-title">Marketing Partners</h2>
        <div className="partners-container">
          <div className="partners-scroll">
            {createDuplicatedLogos(marketingPartners, "marketing")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersShowcase;
