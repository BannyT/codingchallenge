
import React, { useEffect, useState } from "react";
import "./App.css"; 

const POSTCODE = "NR32";
const AREA = "Lowestoft";
const API_URL = `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=${POSTCODE}&area=${AREA}`;

export default function App() {
  const [skips, setSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkipId, setSelectedSkipId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");





  useEffect(() => {
    async function fetchSkips() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to load skip data");
        const data = await res.json();
        setSkips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSkips();
  }, []);

  const selectedSkip = skips.find((skip) => skip.id === selectedSkipId);

  if (loading)
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p className="loading-text">Loading skip options...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-wrapper">
        <div className="error-icon">⚠️</div>
        <p className="error-text">Error loading skip data</p>
        <p className="error-subtext">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );

  return (
    <main className="page-wrapper" aria-label="Choose your skip size page">
      <div className="header">
        <h1 className="page-title">Select Your Skip</h1>
        <p className="page-subtitle">Available in {AREA} ({POSTCODE})</p>

        <div className="view-toggle">
          <button
            onClick={() => setViewMode("grid")}
            className={`toggle-button ${viewMode === "grid" ? "active" : ""}`}
            aria-pressed={viewMode === "grid"}
          >
            {/* Grid Icon SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`toggle-button ${viewMode === "list" ? "active" : ""}`}
            aria-pressed={viewMode === "list"}
          >
            {/* List Icon SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor" />
              <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
              <rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <section className="grid-container" role="list">
          {skips.map((skip) => (
            <SkipCard
              key={skip.id}
              skip={skip}
              isSelected={skip.id === selectedSkipId}
              onSelect={() => setSelectedSkipId(skip.id)}
            />
          ))}
        </section>
      ) : (
        <section className="list-container" role="list">
          {skips.map((skip) => (
            <SkipListItem
              key={skip.id}
              skip={skip}
              isSelected={skip.id === selectedSkipId}
              onSelect={() => setSelectedSkipId(skip.id)}
            />
          ))}
        </section>
      )}

      <div className="footer">
        {selectedSkip && (
          <div className="selection-summary">
            <p className="selected-skip-name">{selectedSkip.name}</p>
            <p className="selected-skip-price">£{selectedSkip.price?.toFixed(2)}</p>
          </div>
        )}
        <button
          disabled={!selectedSkip}
          onClick={() =>
            alert(`You chose: ${selectedSkip.name} - £${selectedSkip.price?.toFixed(2)}`)
          }
          className={`continue-button ${!selectedSkip ? "disabled" : ""}`}
        >
          {selectedSkip ? "Continue to Booking" : "Select a Skip"}
        </button>
      </div>
    </main>
  );
}


function SkipCard({ skip, isSelected, onSelect }) {
  return (
    <article
      role="listitem"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`card ${isSelected ? "selected" : ""}`}
    >
      <div className="card-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill={isSelected ? "#0066FF" : "#888"}>
          <rect x="3" y="6" width="18" height="12" rx="2" stroke={isSelected ? "#0047BB" : "#666"} strokeWidth="2" fill="none" />
          <line x1="3" y1="12" x2="21" y2="12" stroke={isSelected ? "#0047BB" : "#666"} strokeWidth="2" />
        </svg>
      </div>
      <h2 className="card-title">{skip.name}</h2>
      <p className="card-capacity">Holds approx. {skip.capacity}</p>
      <div className="card-price-container">
        <p className="card-price">£{skip.price?.toFixed(2)}</p>
        <p className="card-vat">inc. VAT</p>
      </div>
      {isSelected && (
        <div className="selected-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
      )}
    </article>
  );
}

function SkipListItem({ skip, isSelected, onSelect }) {
  return (
    <article
      role="listitem"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`list-item ${isSelected ? "selected" : ""}`}
    >
      <div className="list-item-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill={isSelected ? "#0066FF" : "#888"}>
          <rect x="3" y="6" width="18" height="12" rx="2" stroke={isSelected ? "#0047BB" : "#666"} strokeWidth="2" fill="none" />
          <line x1="3" y1="12" x2="21" y2="12" stroke={isSelected ? "#0047BB" : "#666"} strokeWidth="2" />
        </svg>
      </div>
      <div className="list-item-content">
        <h2 className="list-item-title">{skip.name}</h2>
        <p className="list-item-capacity">{skip.capacity}</p>
      </div>
      <div className="list-item-price">
        £{skip.price?.toFixed(2)}
        <span className="list-item-vat">inc. VAT</span>
      </div>
      {isSelected && (
        <div className="list-item-check">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0066FF">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
      )}
    </article>
  );
}
