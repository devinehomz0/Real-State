import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
export default function Searchbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const intervalRef = useRef();
  const placeholders = [
    "Search by city...",
    "Search by price...",
    "Search by property type...",
    "Search by neighborhood...",
    "Search by listing ID...",
  ];
  useEffect(() => {
    if (inputValue !== "") {
      clearInterval(intervalRef.current);
      setIsAnimating(false);
      setPrevIndex(null);
      return;
    }
    intervalRef.current = setInterval(() => {
      setPrevIndex(activeIndex);
      setActiveIndex((prev) => (prev + 1) % placeholders.length);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500); // match CSS animation duration
    }, 3000);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [activeIndex, inputValue]);
  return (
    <div className="search_bar">
      <div className="placeholder-stack">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
        {inputValue === "" && (
          <>
            {prevIndex !== null && isAnimating && (
              <span className="placeholder prev">
                {placeholders[prevIndex]}
              </span>
            )}
            <span className={`placeholder ${isAnimating ? "next" : ""}`}>
              {placeholders[activeIndex]}
            </span>
          </>
        )}
        <span className="search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
    </div>
  );
}
