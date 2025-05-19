import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faBath,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/HorListingCarousel.css"; // Your CSS file

// Updated listings data as per your last snippet
const listingsData = [
  {
    id: 1,
    title: "Modern apartment on the bay",
    price: "From $4,500/mo",
    featured: true,
    type: "APARTMENT",
    for: "FOR RENT",
    beds: 4,
    baths: 2,
    area: "1200 Sq Ft",
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Renovated studio",
    price: "$540,000",
    featured: true,
    type: "STUDIO",
    for: "FOR SALE",
    beds: 4,
    baths: 2,
    area: "1200 Sq Ft",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Contemporary apartment",
    price: "$13,000/mo",
    featured: true,
    type: "APARTMENT",
    for: "FOR RENT",
    beds: 4,
    baths: 2,
    area: "1200 Sq Ft",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Awesome family home",
    price: "$570,000",
    featured: false,
    type: "STUDIO",
    for: "FOR SALE",
    beds: 4,
    baths: 2,
    area: "3400 Sq Ft",
    image:
      "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    title: "Renovated studio 2", // Made title unique for clarity
    price: "$545,000",
    featured: true,
    type: "STUDIO",
    for: "FOR SALE",
    beds: 4,
    baths: 2,
    area: "1250 Sq Ft",
    // Using a different image for variety
    image:
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=400&q=80",
  },
];

// Defines how many cards are visible and the gap based on screen width
const getResponsiveSettings = (width, numListings) => {
  if (numListings === 0) {
    return { visibleCards: 0, gap: 0, actualClones: 0 };
  }
  let intendedVisibleCards;
  let gap;

  if (width < 700) {
    // Small screens (mobile)
    intendedVisibleCards = 1;
    gap = 16;
  } else if (width < 1024) {
    // Medium screens (tablet)
    intendedVisibleCards = 2;
    gap = 20;
  } else if (width < 1400) {
    // Large screens
    intendedVisibleCards = 3;
    gap = 24;
  } else {
    // Extra large screens
    intendedVisibleCards = 4; // Max 4 cards
    gap = 24;
  }

  const effectiveVisibleCards = Math.min(intendedVisibleCards, numListings);
  const actualClones =
    numListings > 0 ? Math.min(effectiveVisibleCards, numListings) : 0;

  return { visibleCards: effectiveVisibleCards, gap, actualClones };
};

const HorListingCarousel = ({ listings = listingsData }) => {
  const [carouselConfig, setCarouselConfig] = useState(() =>
    getResponsiveSettings(
      typeof window !== "undefined" ? window.innerWidth : 1024,
      listings.length
    )
  );
  const [current, setCurrent] = useState(carouselConfig.actualClones);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef();
  const outerListRef = useRef(null);

  const [slideTransformMultiplier, setSlideTransformMultiplier] = useState(0);
  const [cardStyleWidthPercentage, setCardStyleWidthPercentage] = useState(0);

  const extendedListings = useMemo(() => {
    if (
      !listings ||
      listings.length === 0 ||
      carouselConfig.actualClones === 0
    ) {
      return listings || [];
    }
    return [
      ...listings.slice(-carouselConfig.actualClones),
      ...listings,
      ...listings.slice(0, carouselConfig.actualClones),
    ];
  }, [listings, carouselConfig.actualClones]);

  const calculateDimensions = useCallback(() => {
    if (
      outerListRef.current &&
      extendedListings.length > 0 &&
      carouselConfig.visibleCards > 0
    ) {
      const W_outer_px = outerListRef.current.offsetWidth;
      const V = carouselConfig.visibleCards;
      const G = carouselConfig.gap;
      const Ext_L = extendedListings.length;

      if (W_outer_px > 0) {
        const cardActualWidthPx = (W_outer_px - (V - 1) * G) / V;
        const cardPerc = (cardActualWidthPx / W_outer_px) * (V / Ext_L) * 100;
        setCardStyleWidthPercentage(cardPerc);

        const shiftAmountPx = cardActualWidthPx + G;
        const transformMultiplier =
          (shiftAmountPx / W_outer_px) * (V / Ext_L) * 100;
        setSlideTransformMultiplier(transformMultiplier);
      }
    } else if (carouselConfig.visibleCards === 0) {
      setCardStyleWidthPercentage(0);
      setSlideTransformMultiplier(0);
    }
  }, [
    extendedListings.length,
    carouselConfig.visibleCards,
    carouselConfig.gap,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const newConfig = getResponsiveSettings(
        window.innerWidth,
        listings.length
      );
      // Only update if there's a meaningful change in configuration
      if (
        newConfig.visibleCards !== carouselConfig.visibleCards ||
        newConfig.gap !== carouselConfig.gap ||
        newConfig.actualClones !== carouselConfig.actualClones
      ) {
        setIsTransitioning(false); // Stop any ongoing transition
        clearInterval(intervalRef.current); // Clear auto-slide
        setCarouselConfig(newConfig);
        // `current` will be reset by the effect below that watches carouselConfig.actualClones
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      // Initial calculation in case window is already at target size
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [listings.length, carouselConfig]); // Rerun if listings or current config changes (though listings.length is main trigger for re-eval)

  useEffect(() => {
    setCurrent(carouselConfig.actualClones);
    calculateDimensions(); // Recalculate when config changes (e.g., visibleCards, clones)
  }, [
    carouselConfig.actualClones,
    carouselConfig.visibleCards,
    calculateDimensions,
  ]);

  const handleNext = useCallback(() => {
    if (isTransitioning || listings.length <= carouselConfig.visibleCards)
      return;
    setIsTransitioning(true);
    setCurrent((prev) => prev + 1);
  }, [isTransitioning, listings.length, carouselConfig.visibleCards]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || listings.length <= carouselConfig.visibleCards)
      return;
    setIsTransitioning(true);
    setCurrent((prev) => prev - 1);
  }, [isTransitioning, listings.length, carouselConfig.visibleCards]);

  // Auto-slide effect
  useEffect(() => {
    if (isTransitioning || listings.length <= carouselConfig.visibleCards) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(handleNext, 4000); // Use handleNext from useCallback
    return () => clearInterval(intervalRef.current);
  }, [
    current,
    isTransitioning,
    listings.length,
    carouselConfig.visibleCards,
    handleNext,
  ]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
    if (listings.length <= carouselConfig.visibleCards) return; // No jumps if all visible

    if (current === listings.length + carouselConfig.actualClones) {
      setCurrent(carouselConfig.actualClones);
    }
    if (current === carouselConfig.actualClones - 1) {
      setCurrent(listings.length + carouselConfig.actualClones - 1);
    }
  }, [
    current,
    listings.length,
    carouselConfig.actualClones,
    carouselConfig.visibleCards,
  ]);

  const pause = useCallback(() => clearInterval(intervalRef.current), []);
  const resume = useCallback(() => {
    if (isTransitioning || listings.length <= carouselConfig.visibleCards)
      return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(handleNext, 4000);
  }, [
    isTransitioning,
    listings.length,
    carouselConfig.visibleCards,
    handleNext,
  ]);

  if (listings.length === 0) {
    return <div className="hor_listing_empty">No listings available.</div>;
  }

  const shouldDisableNav = listings.length <= carouselConfig.visibleCards;

  return (
    <div className="hor_listing">
      <div className="carousel-header">
        <div className="carousel-nav">
          <button
            className="carousel-btn"
            onClick={handlePrev}
            aria-label="Previous"
            disabled={isTransitioning || shouldDisableNav}
          >
            Prev
          </button>
          <button
            className="carousel-btn"
            onClick={handleNext}
            aria-label="Next"
            disabled={isTransitioning || shouldDisableNav}
          >
            Next
          </button>
        </div>
      </div>
      <div
        className="carousel-list-outer"
        ref={outerListRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div
          className="carousel-list-inner"
          style={{
            width:
              carouselConfig.visibleCards > 0
                ? `${
                    (extendedListings.length * 100) /
                    carouselConfig.visibleCards
                  }%`
                : "100%",
            transform: `translateX(-${current * slideTransformMultiplier}%)`,
            transition:
              isTransitioning && !shouldDisableNav
                ? "transform 0.5s cubic-bezier(0.5,0,0.5,1)"
                : "none",
            gap: `${carouselConfig.gap}px`,
          }}
          onTransitionEnd={shouldDisableNav ? undefined : handleTransitionEnd}
        >
          {extendedListings.map((listing, idx) => (
            <div
              className="carousel-card"
              style={{
                width:
                  cardStyleWidthPercentage > 0
                    ? `${cardStyleWidthPercentage}%`
                    : carouselConfig.visibleCards > 0
                    ? `calc(${100 / carouselConfig.visibleCards}% - ${
                        (carouselConfig.gap *
                          (carouselConfig.visibleCards - 1)) /
                        carouselConfig.visibleCards
                      }px)`
                    : "100%",
              }}
              key={`${listing.id}-${idx}-${listing.title}`}
            >
              <div className="carousel-img-wrap">
                <img src={listing.image} alt={listing.title} />
                <div className="carousel-labels">
                  {listing.featured && (
                    <span className="label featured">FEATURED</span>
                  )}
                  <span className="label for">{listing.for}</span>
                </div>
                <div className="carousel-price">{listing.price}</div>
              </div>
              <div className="carousel-title">{listing.title}</div>
              <div className="carousel-info">
                <span>
                  <FontAwesomeIcon icon={faBed} /> {listing.beds}
                </span>
                <span>
                  <FontAwesomeIcon icon={faBath} /> {listing.baths}
                </span>
                <span>
                  <FontAwesomeIcon icon={faRulerCombined} /> {listing.area}
                </span>
              </div>
              <div className="carousel-type">{listing.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorListingCarousel;
