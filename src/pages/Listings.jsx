import React, { useState, useEffect, useCallback, useRef } from "react";
import Footer from "../components/ui_Componets/Footer";
import Navbar from "../components/ui_Componets/navbar";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import "../components/styles/AllListings.css";
import {
  FaSearch,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BsTextareaResize } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const LISTINGS_PER_PAGE_INITIAL = 20;
const LISTINGS_PER_PAGE_MORE = 20;

const UNIT_MULTIPLIERS = {
  Rupees: 1,
  Thousand: 1000,
  Lakh: 100000,
  Crore: 10000000,
};

const convertToRupees = (price, unit) => {
  if (
    price === undefined ||
    price === null ||
    unit === undefined ||
    unit === null
  )
    return null;
  const multiplier = UNIT_MULTIPLIERS[unit] || 1;
  return Number(price) * multiplier;
};

const ListingCard = ({ listing, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const navigateToListing = (listing) => {
    navigate(`/listing`, { state: { listing } });
  };
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
  return (
    <div className="listing-card-item">
      <div
        className="listing-card-image-wrapper"
        onClick={() => {
          navigateToListing(listing);
        }}
      >
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
            {priceDisplay} {priceUnit && price ? priceUnit : ""}
          </span>
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

function ListingsDisplayComponent({
  listings,
  onEdit,
  onListingDeleted,
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
            // onDelete prop would be passed here if ListingCard used it
          />
        ))}
      </div>
    </div>
  );
}

function AllListings({ admin }) {
  console.log(admin);
  console.log("AllListings RENDER START");
  const [allListingsData, setAllListingsData] = useState([]);
  const [displayedListings, setDisplayedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false); // Tracks if the *first* load cycle for current filters has completed
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const [isUsingFallbackQuery, setIsUsingFallbackQuery] = useState(false);
  const isInitialRenderGlobal = useRef(true); // Tracks if it's the very first render of the component lifecycle

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
  // useMemo for priceRanges to ensure stable reference if it were complex or passed down
  const priceRanges = React.useMemo(
    () => [
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
      {
        value: "20000001-",
        label: "Above 2 Cr",
        min: 20000001,
        max: undefined,
      },
    ],
    []
  );

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      console.log(
        `FETCH_DATA: isLoadMore=${isLoadMore}, isInitialRenderGlobal=${isInitialRenderGlobal.current}`
      );
      console.log(
        `FETCH_DATA: Filters: Type=${selectedType}, Status=${selectedStatus}, Fallback=${isUsingFallbackQuery}`
      );

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setAllListingsData([]); // Reset data for a new query/filter set
        setLastVisibleDoc(null);
        setHasMore(true);
        setInitialLoadDone(false); // Mark that we are starting a new load cycle for current filters
      }

      const isPerformingSimplifiedInitialQuery =
        isInitialRenderGlobal.current &&
        !selectedType &&
        !selectedStatus &&
        !isUsingFallbackQuery;
      const shouldUseFallback =
        isUsingFallbackQuery && !isPerformingSimplifiedInitialQuery;

      const constraints = [];
      if (isPerformingSimplifiedInitialQuery) {
        console.log(
          "FETCH_DATA_BUILD: SIMPLIFIED initial query (first component render, no filters)."
        );
      } else if (!shouldUseFallback) {
        console.log(
          "FETCH_DATA_BUILD: Primary query with type/status filters."
        );
        if (selectedType) constraints.push(where("type", "==", selectedType));
        if (selectedStatus)
          constraints.push(where("status", "==", selectedStatus));
      } else {
        console.log("FETCH_DATA_BUILD: FALLBACK query.");
      }

      constraints.push(orderBy("createdAt", "desc"));

      if (isLoadMore && lastVisibleDoc) {
        constraints.push(startAfter(lastVisibleDoc));
      }
      constraints.push(
        limit(isLoadMore ? LISTINGS_PER_PAGE_MORE : LISTINGS_PER_PAGE_INITIAL)
      );

      console.log(
        "FETCH_DATA_BUILD: Final constraints:",
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
        console.log("FETCH_DATA: Docs found:", documentSnapshots.docs.length);

        const newDocs = documentSnapshots.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        if (
          documentSnapshots.empty &&
          !isLoadMore &&
          !shouldUseFallback && // Critical: only try to switch to fallback if not already in fallback
          !isPerformingSimplifiedInitialQuery && // Don't fallback from the initial simplified query
          (selectedType || selectedStatus) // Only trigger fallback if actual server filters were applied
        ) {
          console.log(
            "FETCH_DATA: Primary query for type/status empty. Initiating fallback."
          );
          setShowFallbackMessage(true);
          setIsUsingFallbackQuery(true); // This will trigger the main useEffect again for a fallback fetch
          // setLoading(true) was already set, no need to set it to false here.
          return; // Exit this fetchData call, the useEffect will call it again with isUsingFallbackQuery=true
        }

        // If we've successfully executed a primary query (not fallback, not simplified initial) for some filters,
        // ensure the fallback message is cleared.
        if (
          !isLoadMore &&
          !isUsingFallbackQuery &&
          !isPerformingSimplifiedInitialQuery &&
          (selectedType || selectedStatus)
        ) {
          setShowFallbackMessage(false);
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
        console.error("!!! FETCH_DATA: Firebase Error:", error);
        // TODO: Set an error state to display to user
      } finally {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
        // initialLoadDone is true once a non-loadMore fetch completes (primary, fallback, or initial)
        if (!isLoadMore) {
          setInitialLoadDone(true);
        }
        if (isInitialRenderGlobal.current) {
          isInitialRenderGlobal.current = false; // Mark that the component's very first load cycle has passed
        }
        console.log("FETCH_DATA: finally block. Loading states:", {
          loading,
          loadingMore,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      selectedType,
      selectedStatus,
      isUsingFallbackQuery,
      lastVisibleDoc,
      priceRanges,
    ]
  ); // priceRanges added due to useMemo, lastVisibleDoc for loadMore
  // isInitialRenderGlobal.current should not be a dep.
  // Let's remove lastVisibleDoc, as loadMoreData is separate

  const actualFetchDataDependencies = [
    selectedType,
    selectedStatus,
    isUsingFallbackQuery,
    priceRanges,
  ];
  // We need a stable fetchData for loadMoreData to call if it were to use the same function.
  // For now, loadMoreData is separate.

  // Effect for initial mount and server-side filter changes (Type, Status, Fallback state)
  useEffect(() => {
    console.log("EFFECT: Firestore Fetch useEffect triggered. Deps changed.");
    fetchData(false); // false indicates it's not a "load more" operation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, actualFetchDataDependencies);

  // Client-side search and price filtering
  useEffect(() => {
    console.log(
      "EFFECT: Client-side filtering. Search:",
      searchTerm,
      "Price Range:",
      selectedPriceRange,
      "Data size:",
      allListingsData.length
    );
    let filtered = [...allListingsData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title?.toLowerCase().includes(term) ||
          l.address?.toLowerCase().includes(term) ||
          l.city?.toLowerCase().includes(term) ||
          l.state?.toLowerCase().includes(term) ||
          String(l.price).includes(term)
      );
    }

    if (selectedPriceRange) {
      const priceRangeObj = priceRanges.find(
        (r) => r.value === selectedPriceRange
      );
      if (priceRangeObj) {
        filtered = filtered.filter((l) => {
          const actualPriceInRupees = convertToRupees(l.price, l.priceUnit);
          if (actualPriceInRupees === null) return false;
          let passMin = true;
          let passMax = true;
          if (priceRangeObj.min !== undefined) {
            passMin = actualPriceInRupees >= priceRangeObj.min;
          }
          if (priceRangeObj.max !== undefined) {
            passMax = actualPriceInRupees <= priceRangeObj.max;
          }
          return passMin && passMax;
        });
      }
    }
    console.log("EFFECT: Client-side filtering. Result size:", filtered.length);
    setDisplayedListings(filtered);
  }, [searchTerm, selectedPriceRange, allListingsData, priceRanges]);

  // loadMoreData needs to be a separate function because fetchData is rebuilt
  // if we want to use fetchData directly for load more, fetchData's dependencies need care.
  // For simplicity, keeping loadMoreData separate, duplicating some logic.
  const loadMoreData = async () => {
    if (!hasMore || loading || loadingMore) return;
    console.log("LOAD_MORE_FUNC: called. Fallback:", isUsingFallbackQuery);
    setLoadingMore(true);

    const isPerformingSimplifiedInitialQuery =
      isInitialRenderGlobal.current &&
      !selectedType &&
      !selectedStatus &&
      !isUsingFallbackQuery;
    const shouldUseFallback =
      isUsingFallbackQuery && !isPerformingSimplifiedInitialQuery;

    const constraints = [];
    if (isPerformingSimplifiedInitialQuery) {
      // This case should not happen for "load more" as initial query would have run
    } else if (!shouldUseFallback) {
      if (selectedType) constraints.push(where("type", "==", selectedType));
      if (selectedStatus)
        constraints.push(where("status", "==", selectedStatus));
    }
    constraints.push(orderBy("createdAt", "desc"));
    if (lastVisibleDoc) constraints.push(startAfter(lastVisibleDoc));
    constraints.push(limit(LISTINGS_PER_PAGE_MORE));

    console.log(
      "LOAD_MORE_FUNC: Constraints:",
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
      const newDocs = documentSnapshots.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setAllListingsData((prev) => [...prev, ...newDocs]); // Append for client-side filter
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
  };

  const handleServerFilterChange = (setter, value) => {
    console.log("UI: Server Filter changed. Resetting for new query.");
    // When a server-side filter (type, status) changes, we want to:
    // 1. Reset the fallback state, assuming we'll try a primary query first.
    // 2. Clear any existing fallback message.
    // 3. The main useEffect for data fetching will be triggered by 'setter(value)',
    //    and 'fetchData' will handle resetting data and loading states.
    setIsUsingFallbackQuery(false);
    setShowFallbackMessage(false);
    setter(value); // e.g., setSelectedType(value)
  };

  return (
    <div>
      {!admin && <Navbar />}
      <div className="listings-page-container">
        <div
          className={`filters-container ${
            admin != true ? "" : "admin_listing"
          }`}
        >
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by Title, Address, City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
            <button className="search-icon-button" aria-label="Search">
              <FaSearch />
            </button>
          </div>
          <select
            value={selectedType}
            onChange={(e) =>
              handleServerFilterChange(setSelectedType, e.target.value)
            }
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
            onChange={(e) =>
              handleServerFilterChange(setSelectedStatus, e.target.value)
            }
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
              // This is line 427 based on original context
              console.log("UI: Price changed (client-side):", e.target.value);
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
            No listings found for the selected Type/Status. Showing all recent
            listings instead. You can refine with other filters.
          </p>
        )}
        <ListingsDisplayComponent
          listings={displayedListings}
          onEdit={handleEdit}
          onListingDeleted={refreshListingsAfterDelete}
          loading={loading && !initialLoadDone} // Show main loading when not loadingMore and initialLoad for current filter set is not done
        />
        {loadingMore && <div className="listings-loader">Loading more...</div>}

        {!loading &&
          !loadingMore &&
          hasMore &&
          displayedListings.length > 0 && ( // Only show load more if there are already items
            <div className="load-more-container">
              <button onClick={loadMoreData} disabled={loadingMore || loading}>
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

        {!loading &&
          !loadingMore &&
          initialLoadDone &&
          displayedListings.length === 0 && (
            <p className="no-listings-found">
              {searchTerm ||
              selectedPriceRange ||
              selectedType ||
              selectedStatus
                ? "No listings found matching your criteria."
                : "No listings available at the moment."}
            </p>
          )}
      </div>
      {!admin && <Footer />}
    </div>
  );
}
export default AllListings;
