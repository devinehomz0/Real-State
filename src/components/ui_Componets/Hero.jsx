import { useState, useEffect } from "react";
import Navbar from "./navbar";
import "../styles/hero.css";

let images = [
  "https://default.houzez.co/wp-content/uploads/2020/03/miami-beach.jpg",
  "https://default.houzez.co/wp-content/uploads/2016/03/new-york.jpg",
  "https://default.houzez.co/wp-content/uploads/2016/03/chicago.jpg",
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="Hero_main">
      <div className="hero-bg-wrapper">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`hero-bg-img ${activeIndex === idx ? "active" : ""}`}
            style={{
              backgroundImage: `
                linear-gradient(
                  to bottom,
                  rgba(0, 61, 120, 0.7) 0%,
                  rgba(0, 61, 120, 0.6) 30%,
                  rgba(0, 61, 120, 0.5) 60%,
                  rgba(0, 61, 120, 0.7) 100%
                ),
                url(${img})
              `,
            }}
          />
        ))}
      </div>
      <div className="hero-content">
        <Navbar />
        <div className="hero-center-content">
          <h1>Welcome to <br className="br_welcome"/> Devine Homz</h1>
          <p>
            Devine Homz is dedicated to helping you find the perfect property, <br className="br_p"/>
                      whether you're buying, selling, or renting. Experience seamless real <br />
            estate solutions with our expert team.
          </p>

        </div>
        <div className="hero_buttons">
          <a href="">Explore Listings</a>
          <a href="">Contact Us</a>
        </div>
      </div>
    </div>
  );
}
