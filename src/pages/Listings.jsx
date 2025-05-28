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
  doc, // Added for delete
  deleteDoc, // Added for delete
} from "firebase/firestore";
import "../components/styles/AllListings.css";
import {
  FaSearch,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEdit, // Ensure this is available
  FaTrash, // Ensure this is available
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

// --- ListingCard Component ---
const ListingCard = ({ listing, onEdit, onDelete, admin }) => {
  // Added admin prop
  const navigate = useNavigate();
  const navigateToListing = (listingData) => {
    // Renamed listing to listingData to avoid conflict
    navigate(`/listing`, { state: { listing: listingData } });
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
      {admin && (
        <div className="listing-card-admin-actions">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click if buttons are inside clickable area
              onEdit(listing);
            }}
            className="admin-action-button edit-button"
            aria-label="Edit Listing"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(listing.id);
            }}
            className="admin-action-button delete-button"
            aria-label="Delete Listing"
          >
            <FaTrash /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

// --- ListingsDisplayComponent ---
function ListingsDisplayComponent({
  listings,
  onEditListing, // Renamed to match prop from AllListings
  onDeleteListing, // Renamed to match prop from AllListings
  loading,
  admin, // Added admin prop
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
            onEdit={onEditListing} // Pass down directly
            onDelete={onDeleteListing} // Pass down directly
            admin={admin} // Pass down admin status
          />
        ))}
      </div>
    </div>
  );
}

// --- AllListings Component ---
function AllListings({ admin }) {
  console.log("Admin status in AllListings:", admin);
  const navigate = useNavigate(); // For edit navigation
  console.log("AllListings RENDER START");
  const [allListingsData, setAllListingsData] = useState([]);
  const [displayedListings, setDisplayedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const [isUsingFallbackQuery, setIsUsingFallbackQuery] = useState(false);
  const isInitialRenderGlobal = useRef(true);

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
  const priceRanges = React.useMemo(
    () => [
      { value: "", label: "Any Price" },
      { value: "0-4000000", label: "Up to 40 Lakh",  min: 4000001,
        max: 10000000, },
      {
        value: "4000001-10000000",
        label: "40 Lakh - 1 Cr",
       min: 0, max: 4000000
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
        setAllListingsData([]);
        setLastVisibleDoc(null);
        setHasMore(true);
        setInitialLoadDone(false);
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
        console.log("FETCH_DATA_BUILD: SIMPLIFIED initial query.");
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

      try {
        const q = query(collection(db, "listings"), ...constraints);
        const documentSnapshots = await getDocs(q);
        const newDocs = documentSnapshots.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        if (
          documentSnapshots.empty &&
          !isLoadMore &&
          !shouldUseFallback &&
          !isPerformingSimplifiedInitialQuery &&
          (selectedType || selectedStatus)
        ) {
          setShowFallbackMessage(true);
          setIsUsingFallbackQuery(true);
          return;
        }
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
      } finally {
        if (isLoadMore) setLoadingMore(false);
        else setLoading(false);
        if (!isLoadMore) setInitialLoadDone(true);
        if (isInitialRenderGlobal.current)
          isInitialRenderGlobal.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedType,
      selectedStatus,
      isUsingFallbackQuery,
      lastVisibleDoc /* for loadMore in useCallback, but loadMoreData is separate */,
    ]
    // Removed priceRanges as it's not directly used in server query constraints here
    // Re-add lastVisibleDoc because if fetchData were used for loadMore, it would be needed.
    // For current separate loadMoreData, it's not strictly needed for *this* useCallback, but doesn't hurt.
  );

  const actualFetchDataDependencies = [
    selectedType,
    selectedStatus,
    isUsingFallbackQuery,
  ]; // priceRanges removed as it's stable and not directly in server query here

  useEffect(() => {
    console.log("EFFECT: Firestore Fetch useEffect triggered. Deps changed.");
    fetchData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, actualFetchDataDependencies);

  useEffect(() => {
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
          let passMin = true,
            passMax = true;
          if (priceRangeObj.min !== undefined)
            passMin = actualPriceInRupees >= priceRangeObj.min;
          if (priceRangeObj.max !== undefined)
            passMax = actualPriceInRupees <= priceRangeObj.max;
          return passMin && passMax;
        });
      }
    }
    setDisplayedListings(filtered);
  }, [searchTerm, selectedPriceRange, allListingsData, priceRanges]);

  const loadMoreData = async () => {
    if (!hasMore || loading || loadingMore) return;
    setLoadingMore(true);
    const isPerformingSimplifiedInitialQuery =
      isInitialRenderGlobal.current &&
      !selectedType &&
      !selectedStatus &&
      !isUsingFallbackQuery;
    const shouldUseFallback =
      isUsingFallbackQuery && !isPerformingSimplifiedInitialQuery;
    const constraints = [];
    if (!isPerformingSimplifiedInitialQuery && !shouldUseFallback) {
      if (selectedType) constraints.push(where("type", "==", selectedType));
      if (selectedStatus)
        constraints.push(where("status", "==", selectedStatus));
    }
    constraints.push(orderBy("createdAt", "desc"));
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

  const handleServerFilterChange = (setter, value) => {
    setIsUsingFallbackQuery(false);
    setShowFallbackMessage(false);
    setter(value);
  };

  // --- Edit and Delete Handlers ---
  const handleEditListing = (listingToEdit) => {
    console.log("Navigating to edit page for listing ID:", listingToEdit.id);
    // Ensure you have a route like '/edit-listing/:listingId'
    navigate(`/admin/create-property`, {
      state: { listing: listingToEdit },
    });
  };

  const refreshListingsAfterDelete = (deletedListingId) => {
    console.log(
      "REFRESH_DELETE: Removing listing from local state:",
      deletedListingId
    );
    setAllListingsData((prev) =>
      prev.filter((item) => item.id !== deletedListingId)
    );
    // Note: displayedListings will auto-update due to its useEffect dependency on allListingsData
  };

  const handleDeleteListing = async (listingIdToDelete) => {
    if (!listingIdToDelete) {
      console.error("Delete action called without listing ID.");
      return;
    }
    // Optional: Add a confirmation dialog here
    if (
      !window.confirm(
        "Are you sure you want to delete this listing? This action cannot be undone."
      )
    ) {
      return;
    }
    console.log(
      "Attempting to delete listing from Firestore:",
      listingIdToDelete
    );
    try {
      const listingDocRef = doc(db, "listings", listingIdToDelete);
      await deleteDoc(listingDocRef);
      console.log(
        "Listing deleted successfully from Firestore:",
        listingIdToDelete
      );
      refreshListingsAfterDelete(listingIdToDelete); // Update client-side state
    } catch (error) {
      console.error(
        "Error deleting listing from Firestore:",
        listingIdToDelete,
        error
      );
      alert("Failed to delete listing. Please try again."); // User feedback
    }
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
            onChange={(e) => setSelectedPriceRange(e.target.value)}
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
          loading={loading && !initialLoadDone}
          admin={admin} // Pass admin status down
          onEditListing={handleEditListing} // Pass edit handler
          onDeleteListing={handleDeleteListing} // Pass delete handler
        />
        {loadingMore && <div className="listings-loader">Loading more...</div>}
        {!loading &&
          !loadingMore &&
          hasMore &&
          displayedListings.length > 0 && (
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
