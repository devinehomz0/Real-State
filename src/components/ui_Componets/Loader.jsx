// src/components/DevineHomzLoader.js
import "../styles/Loader.css";

const DevineHomzLoader = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="devine-homz-loader-overlay">
      <div className="devine-homz-loader-content">
        <div className="devine-homz-spinner"></div>
        <p className="devine-homz-loader-text">Loading ...</p>
      </div>
    </div>
  );
};

export default DevineHomzLoader;
