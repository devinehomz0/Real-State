import React, { useState, useEffect, useCallback, useRef } from "react";
import Footer from "../components/ui_Componets/Footer";
import Navbar from "../components/ui_Componets/navbar";
import { db } from "../config/firebase";
import SearchBar from "../components/ui_Componets/SearchBar"
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "../components/styles/AllListings.css";
import {
  FaSearch,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { BsTextareaResize } from "react-icons/bs";

const LISTINGS_PER_PAGE_INITIAL = 10;
const LISTINGS_PER_PAGE_MORE = 10;

// --- ListingCard Component (Assumed OK) ---
const ListingCard = ({ listing, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    imageUrls = [],
    type = "N/A",
    status = "",
    price,
    title = "Untitled Listing",
    address = "",
    city = "",
    state = "",
    bedrooms,
    bathrooms,
    superBuiltupArea,
    featured,
    priceUnit,
  } = listing;
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };
  const displayFullAddress = [address, city, state].filter(Boolean).join(", ");
  let priceDisplay = "Contact for Price";
  if (price) {
    priceDisplay = `₹${Number(price).toLocaleString()}`;
    if (status === "For Rent") priceDisplay += "/mo";
  }
  let priceSqFtDisplay = "";
  if (price && superBuiltupArea && status !== "For Rent") {
    const ppsqft = parseFloat(price) / parseFloat(superBuiltupArea);
    if (!isNaN(ppsqft))
      priceSqFtDisplay = `₹${ppsqft.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}/sq ft`;
  }
  return (
    <div className="listing-card-item">
      <div className="listing-card-image-wrapper">
        {imageUrls && imageUrls.length > 0 ? (
          <img
            src={imageUrls[currentImageIndex]}
            alt={`${title} ${currentImageIndex + 1}`}
            className="listing-card-image"
          />
        ) : (
          <div className="listing-card-no-image">No Image</div>
        )}
        {imageUrls && imageUrls.length > 1 && (
          <>
            <button onClick={prevImage} className="carousel-arrow prev-arrow">
              <FaChevronLeft />
            </button>
            <button onClick={nextImage} className="carousel-arrow next-arrow">
              <FaChevronRight />
            </button>
          </>
        )}
        {status && (
          <div
            className={`status-badge ${status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {status.toUpperCase()}
          </div>
        )}{" "}
        {featured && <div className="featured-badge">FEATURED</div>}
      </div>
      <div className="listing-card-content">
        <div className="listing-card-type">
          {type ? type.toUpperCase() : "PROPERTY"}
        </div>
        <div className="listing-card-price-container">
          <span className="listing-card-price">
            {priceDisplay} {listing.priceUnit}
          </span>
          {/* {priceSqFtDisplay && (
            <span className="listing-card-price-sqft">{priceSqFtDisplay}</span>
          )} */}
        </div>
        <h3 className="listing-card-title" title={title}>
          {title}
        </h3>
        {displayFullAddress && (
          <p className="listing-card-address" title={displayFullAddress}>
            <FaMapMarkerAlt className="address-icon" /> {displayFullAddress}
          </p>
        )}
        <div className="listing-card-features">
          {bedrooms !== undefined && (
            <span>
              <FaBed className="feature-icon" /> {bedrooms} Beds
            </span>
          )}{" "}
          {bathrooms !== undefined && (
            <span>
              <FaBath className="feature-icon" /> {bathrooms} Baths
            </span>
          )}{" "}
          {superBuiltupArea !== undefined && (
            <span>
              <BsTextareaResize className="feature-icon" /> {superBuiltupArea}{" "}
              sq ft
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- ListingsDisplay Component (Assumed OK) ---
function ListingsDisplayComponent({
  listings,
  onEdit,
  fetchListings: refreshListingsCallback,
  loading,
}) {
  
  if (loading)
    return <div className="listings-loader">Loading Properties...</div>;
  if (!listings || listings.length === 0) return null;
  return (
    <div className="listings-grid-wrapper">
      <div className="listings-grid">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}

function AllListings() {
  console.log("AllListings RENDER START");
  const [allListingsData, setAllListingsData] = useState([]);
  const [displayedListings, setDisplayedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null); // Renamed for clarity
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const [isUsingFallbackQuery, setIsUsingFallbackQuery] = useState(false);
  const isInitialRender = useRef(true);

  const propertyTypes = [
    { value: "", label: "All Types" },
    { value: "Flats / Apartments", label: "Flats / Apartments" },
    {
      value: "Independent / Builder Floors",
      label: "Independent / Builder Floors",
    },
    { value: "Farm House", label: "Farm House" },
    { value: "House & Villa", label: "House & Villa" },
  ];
  const propertyStatuses = [
    { value: "", label: "Any Status" },
    { value: "For Sale", label: "For Sale" },
    { value: "For Rent", label: "For Rent" },
  ];
  const priceRanges = [
    { value: "", label: "Any Price" },
    { value: "0-4000000", label: "Up to 40 Lakh", min: 0, max: 4000000 },
    {
      value: "4000001-10000000",
      label: "40 Lakh - 1 Cr",
      min: 4000001,
      max: 10000000,
    },
    {
      value: "10000001-20000000",
      label: "1 Cr - 2 Cr",
      min: 10000001,
      max: 20000000,
    },
    { value: "20000001-", label: "Above 2 Cr", min: 20000001 },
  ];

  // This function is now defined inside the useEffect or called from there,
  // ensuring it always has the latest state values if not passed as args.
  // Or, define it outside and pass all dependencies as args.
  // Let's try defining the core fetch logic inside useEffect for simplicity of closure.

  // Effect for initial mount and filter changes
  useEffect(() => {
    console.log("EFFECT: Filter/Mount useEffect triggered. Filters:", {
      selectedType,
      selectedStatus,
      selectedPriceRange,
    });

    const fetchData = async (isLoadMore = false) => {
      console.log(
        `EFFECT_FETCH: isLoadMore=${isLoadMore}, isInitialRender=${isInitialRender.current}`
      );
      console.log(
        `EFFECT_FETCH: Current Filters: Type=${selectedType}, Status=${selectedStatus}, Price=${selectedPriceRange}, isUsingFallback=${isUsingFallbackQuery}`
      );

      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      let isPerformingInitialSimple = false;
      if (isInitialRender.current) {
        isPerformingInitialSimple = true;
      }

      const forFallback = isUsingFallbackQuery && !isPerformingInitialSimple;

      const constraints = [];
      if (isPerformingInitialSimple) {
        console.log("EFFECT_FETCH_BUILD: SIMPLIFIED initial query.");
        constraints.push(orderBy("createdAt", "desc"));
      } else if (!forFallback) {
        console.log("EFFECT_FETCH_BUILD: FULL query with filters.");
        if (selectedType) constraints.push(where("type", "==", selectedType));
        if (selectedStatus)
          constraints.push(where("status", "==", selectedStatus));
        const priceRangeObj = priceRanges.find(
          (r) => r.value === selectedPriceRange
        );
        if (
          priceRangeObj &&
          (priceRangeObj.min !== undefined || priceRangeObj.max !== undefined)
        ) {
          if (priceRangeObj.min !== undefined)
            constraints.push(where("price", ">=", priceRangeObj.min));
          if (priceRangeObj.max !== undefined)
            constraints.push(where("price", "<=", priceRangeObj.max));
          constraints.push(orderBy("price"));
        }
        constraints.push(orderBy("createdAt", "desc"));
      } else {
        // Fallback query
        console.log("EFFECT_FETCH_BUILD: FALLBACK query.");
        constraints.push(orderBy("createdAt", "desc"));
      }

      if (isLoadMore && lastVisibleDoc) {
        constraints.push(startAfter(lastVisibleDoc));
      }
      constraints.push(
        limit(isLoadMore ? LISTINGS_PER_PAGE_MORE : LISTINGS_PER_PAGE_INITIAL)
      );
      console.log(
        "EFFECT_FETCH_BUILD: Final constraints:",
        constraints.map(
          (c) =>
            `${c.type} ${c._fiel || ""} ${c._op || ""} ${c._values || ""} ${
              c._direction || ""
            }`
        )
      );

      try {
        const q = query(collection(db, "listings"), ...constraints);
        const documentSnapshots = await getDocs(q);
        console.log("EFFECT_FETCH: Docs found:", documentSnapshots.docs.length);
        if (documentSnapshots.docs.length > 0)
          console.log(
            "EFFECT_FETCH: First doc:",
            documentSnapshots.docs[0].id,
            documentSnapshots.docs[0].data().title
          );

        const newDocs = documentSnapshots.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        if (
          documentSnapshots.empty &&
          !isLoadMore &&
          !forFallback &&
          !isPerformingInitialSimple
        ) {
          console.log(
            "EFFECT_FETCH: Primary query empty. Initiating fallback."
          );
          // This state change will cause this useEffect to re-run
          setShowFallbackMessage(true);
          setIsUsingFallbackQuery(true);
          // No direct recursive call, the state change triggers re-run
          setLoading(false); // Ensure loading stops for this attempt
          return;
        }

        setAllListingsData((prev) =>
          isLoadMore ? [...prev, ...newDocs] : newDocs
        );
        setLastVisibleDoc(
          documentSnapshots.docs[documentSnapshots.docs.length - 1] || null
        );
        setHasMore(
          newDocs.length ===
            (isLoadMore ? LISTINGS_PER_PAGE_MORE : LISTINGS_PER_PAGE_INITIAL)
        );
      } catch (error) {
        console.error("!!! EFFECT_FETCH: Firebase Error:", error);
      } finally {
        if (isLoadMore) setLoadingMore(false);
        else setLoading(false);
        if (!initialLoadDone) setInitialLoadDone(true);
        if (isInitialRender.current) isInitialRender.current = false; // Mark initial render as done
        console.log("EFFECT_FETCH: finally block. Loading states:", {
          loading,
          loadingMore,
        });
      }
    };

    // Reset states before fetching, unless it's a "load more" operation
    // The "isUsingFallbackQuery" change will trigger this useEffect again for fallback.
    if (!loadingMore) {
      // Only reset if not loading more
      setAllListingsData([]);
      setLastVisibleDoc(null);
      setHasMore(true);
      setInitialLoadDone(false); // Will be set true in fetchData's finally
      // Reset fallback only if filters actually changed, not if fallback state itself changed
      // This part is tricky. If isUsingFallbackQuery changed to true, we don't want to reset it here.
      // Let's manage fallback reset more carefully.
      if (!isInitialRender.current && !isUsingFallbackQuery) {
        // If filters changed and not currently in fallback
        setShowFallbackMessage(false);
      }
    }

    // If isUsingFallbackQuery was just set to true, this useEffect runs again.
    // fetchData will see isUsingFallbackQuery as true and construct a fallback query.
    fetchData(false); // Initial fetch for current filter set or fallback
  }, [selectedType, selectedStatus, selectedPriceRange, isUsingFallbackQuery]); // isUsingFallbackQuery is now a key dependency

  // Client-side search filtering
  useEffect(() => {
    if (!searchTerm) {
      setDisplayedListings(allListingsData);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = allListingsData.filter(
      (l) =>
        l.title?.toLowerCase().includes(term) ||
        l.address?.toLowerCase().includes(term) ||
        String(l.price).includes(term)
    );
    setDisplayedListings(filtered);
  }, [searchTerm, allListingsData]);

  const handleLoadMore = () => {
    console.log(
      "LOADMORE: clicked. Current fallback state:",
      isUsingFallbackQuery
    );
    if (hasMore && !loading && !loadingMore) {
      // The fetchData function needs to be callable here with "isLoadMore = true"
      // We need a way to call the fetchData defined in the useEffect or redefine it here
      // For now, let's simplify: LoadMore will re-trigger the main useEffect by changing a dummy state, or call a useCallback version
      // This is not ideal. Let's make fetchData a useCallback.

      // This is getting complex. The core issue is that fetchData depends on states that might change.
      // A better approach might be to make `fetchData` a `useCallback` that takes all it needs.
      // But then the main useEffect needs to call it.
      // Re-evaluating the fetchData placement.

      // Let's go back to fetchListingsData as a useCallback
      // and the useEffect calls it with current filter states. This seems more standard.
      // The previous attempt (your last provided code) was closer. The issue might have been
      // subtle in the useCallback dependencies or how the simple fetch flag was managed.

      // For THIS current structure, handleLoadMore cannot easily call the fetchData inside useEffect.
      // This implies the fetchData logic should be a top-level useCallback.

      // --> The structure from your *last* provided code was actually on a better track.
      // --> The error was likely in subtle dependency array management or the initial simple fetch logic.
      // --> Let's revert to that structure and debug it carefully.

      // For now, this load more will NOT work with fetchData inside useEffect.
      // This signals a structural refactor is needed back to what you had.
      console.error(
        "Load More needs refactoring with current fetchData structure"
      );
    }
  };

  // Re-defining a loadMore specific fetch (temporary fix for this structure)
  const loadMoreData = async () => {
    if (!hasMore || loading || loadingMore) return;
    console.log("LOAD_MORE_FUNC: called. Fallback:", isUsingFallbackQuery);
    setLoadingMore(true);

    const forFallback = isUsingFallbackQuery; // Use current fallback state
    const constraints = [];
    if (!forFallback) {
      if (selectedType) constraints.push(where("type", "==", selectedType));
      if (selectedStatus)
        constraints.push(where("status", "==", selectedStatus));
      const priceRangeObj = priceRanges.find(
        (r) => r.value === selectedPriceRange
      );
      if (
        priceRangeObj &&
        (priceRangeObj.min !== undefined || priceRangeObj.max !== undefined)
      ) {
        if (priceRangeObj.min !== undefined)
          constraints.push(where("price", ">=", priceRangeObj.min));
        if (priceRangeObj.max !== undefined)
          constraints.push(where("price", "<=", priceRangeObj.max));
        constraints.push(orderBy("price"));
      }
      constraints.push(orderBy("createdAt", "desc"));
    } else {
      constraints.push(orderBy("createdAt", "desc"));
    }
    if (lastVisibleDoc) constraints.push(startAfter(lastVisibleDoc));
    constraints.push(limit(LISTINGS_PER_PAGE_MORE));

    try {
      const q = query(collection(db, "listings"), ...constraints);
      const documentSnapshots = await getDocs(q);
      const newDocs = documentSnapshots.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setAllListingsData((prev) => [...prev, ...newDocs]);
      setLastVisibleDoc(
        documentSnapshots.docs[documentSnapshots.docs.length - 1] || null
      );
      setHasMore(newDocs.length === LISTINGS_PER_PAGE_MORE);
    } catch (e) {
      console.error("Load more error", e);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleEdit = (listing) => console.log("Edit listing:", listing.id);
  const refreshListingsAfterDelete = (deletedListingId) => {
    console.log("REFRESH_DELETE: called for", deletedListingId);
    setAllListingsData((prev) =>
      prev.filter((item) => item.id !== deletedListingId)
    );
    // Optionally, could re-trigger a full fetch from the main useEffect by toggling a dummy state,
    // but client-side removal is often sufficient for delete.
    // To re-fetch, you'd ideally call the main fetch logic.
    // This also indicates fetchData should be a top-level useCallback.
  };

  console.log(
    "RENDER: Displayed:",
    displayedListings.length,
    "Loading:",
    loading,
    "InitialLoadDone:",
    initialLoadDone
  );

  return (
    <div>
      <Navbar />
      <div className="listings-page-container">
        <div className="filters-container">
          <div className="search-bar">

            {" "}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />{" "}
            <button className="search-icon-button">
              <FaSearch />
            </button>{" "}
          </div>
          <select
            value={selectedType}
            onChange={(e) => {
              console.log("UI: Type changed:", e.target.value);
              setIsUsingFallbackQuery(false);
              setShowFallbackMessage(false);
              setSelectedType(e.target.value);
            }}
            className="filter-select"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => {
              console.log("UI: Status changed:", e.target.value);
              setIsUsingFallbackQuery(false);
              setShowFallbackMessage(false);
              setSelectedStatus(e.target.value);
            }}
            className="filter-select"
          >
            {propertyStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <select
            value={selectedPriceRange}
            onChange={(e) => {
              console.log("UI: Price changed:", e.target.value);
              setIsUsingFallbackQuery(false);
              setShowFallbackMessage(false);
              setSelectedPriceRange(e.target.value);
            }}
            className="filter-select"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        {showFallbackMessage && (
          <p className="fallback-message">
            No listings for filters. Showing recent.
          </p>
        )}
        <ListingsDisplayComponent
          listings={displayedListings}
          onEdit={handleEdit}
          fetchListings={refreshListingsAfterDelete}
          loading={loading && !initialLoadDone && !loadingMore}
        />
        {loadingMore && <div className="listings-loader">Loading more...</div>}
        {!loading && hasMore && displayedListings.length > 0 && (
          <div className="load-more-container">
            <button onClick={loadMoreData} disabled={loadingMore || loading}>
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        {!loading && initialLoadDone && displayedListings.length === 0 && (
          <p className="no-listings-found">
            {isUsingFallbackQuery && allListingsData.length === 0
              ? "No listings available."
              : "No listings found for search."}
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
export default AllListings;
