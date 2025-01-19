import React, { useState } from 'react';
import './RightSection.css';

const RightSection = ({ selectedPlace }) => {
  const [showMoreTags, setShowMoreTags] = useState(false);

  const accessibilityTags = [
    "Stroller-friendly",
    "Wheel-chair accessible",
    "Pet-friendly",
    "Parking available",
    "Restrooms",
    "Elevator access",
    "Braille signage"
  ];

  const Star = ({ filled }) => (
    <svg className={`star ${filled ? 'filled' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <polygon
        points="12 2 15 10 24 10 18 15 20 24 12 19 4 24 6 15 0 10 9 10"
        stroke="black"
        fill={filled ? "yellow" : "none"}
        strokeWidth="1"
      />
    </svg>
  );

  if (!selectedPlace) {
    return (
      <section className="right-section">
        <h2>Select a location or search for one</h2>
      </section>
    );
  }

  return (
    <section className="right-section">
      {/* Location Image */}
      <img
        src={selectedPlace.photos && selectedPlace.photos[0] ? selectedPlace.photos[0] : 'https://via.placeholder.com/150'}
        alt={selectedPlace.name}
        className="location-image"
      />

      {/* Location Info */}
      <div className="location-info">
        <h1 className="location-name">{selectedPlace.name}</h1>
        <h2 className="location-address">{selectedPlace.address}</h2>
        <p className="location-description">
          This is a sample description of the location. Customize this to add more details about the place.
        </p>
        <div className="rating-section">
          {selectedPlace.rating && (
            <>
              <span className="overall-rating">{selectedPlace.rating}</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} filled={i < Math.round(selectedPlace.rating)} />
              ))}
              <p className="number-of-reviews">100 reviews</p>
            </>
          )}
        </div>
        <button className="write-review-button">Write a Review</button>
      </div>

      {/* Accessibility Tags */}
      <div className="tags-section">
        {accessibilityTags.map((tag, index) => {
          if (!showMoreTags && index >= 5) return null;
          return <span key={index} className="tag">{tag}</span>;
        })}
        {accessibilityTags.length > 5 && (
          <button className="see-more-tags" onClick={() => setShowMoreTags(!showMoreTags)}>
            {showMoreTags ? 'See less' : 'See more'}
          </button>
        )}
      </div>

      {/* Detailed Ratings */}
      <div className="star-ratings">
        <div className="rating">
          <span className="rating-title">Physical</span>
          <span className="rating-value">4</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} filled={i < 4} />
            ))}
          </div>
        </div>
        <div className="rating">
          <span className="rating-title">Auditory</span>
          <span className="rating-value">3</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} filled={i < 3} />
            ))}
          </div>
        </div>
        <div class="rating">
          <span class="rating-title">Visual</span>
          <span class="rating-value">5</span>
          <div class="stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} filled={i < 5} />
            ))}
          </div>
        </div>
        <div class="rating">
          <span class="rating-title">Cognitive</span>
          <span class="rating-value">2</span>
          <div class="stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} filled={i < 2} />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Summary */}
      <h3 className="reviews-summary-title">Reviews Summary✨</h3>
      <p className="reviews-summary">
        This is a summary of the reviews. It provides an overview of what people think about the location.
      </p>
      <button className="read-reviews-button">Read Reviews</button>
    </section>
  );
};

export default RightSection;