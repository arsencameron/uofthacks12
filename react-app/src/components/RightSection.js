import React, { useState } from 'react';
import './RightSection.css';
import Review from './Review.js'

const RightSection = ({ sortedLocations, selectedPlace, handleWriteReviewClick }) => {
  const [showMoreTags, setShowMoreTags] = useState(false);
  const [showReview, setShowReview] = useState(false);

    if (sortedLocations && sortedLocations.length > 0) {
        return (
            <section className="right-section">
                <h2>Sorted Locations</h2>
                <ul className="location-list">
                    {sortedLocations.map((location, index) => (
                        <li key={index} className="location-item">
                            <p>{location[0]}</p>
                        </li>
                    ))}
                </ul>
            </section>
        );
    }
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

  // If "Write a Review" has been clicked, show the Review component instead
  if (showReview) {
    return (
      <section className="right-section">
        <Review selectedPlace={selectedPlace}/>
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
        <button className="write-review-button" onClick={() => setShowReview(true)}>Write a Review</button>
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
                <div className="rating">
                    <span className="rating-title">Visual</span>
                    <span className="rating-value">5</span>
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} filled={i < 5} />
                        ))}
                    </div>
                </div>
                <div className="rating">
                    <span className="rating-title">Cognitive</span>
                    <span className="rating-value">2</span>
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} filled={i < 2} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews Summary */}
            {/* Reviews Summary */}
            <h3 className="reviews-summary-title">Reviews Summary✨</h3>
            <p className="reviews-summary">
                {"34 users gave a five-star rating across all accessibility categories (visual, auditory, physical, cognitive, and overall). Reviews specifically highlights the ease of wheelchair navigation, stating \"I can move my wheelchair freely.\"  The positive feedback indicates excellent accessibility features at this location, making it highly suitable for wheelchair users. The overall experience was deemed \"Great Overall!\"\n"}
            </p>

            <button className="read-reviews-button">Read Reviews</button>
        </section>
    );
};

export default RightSection;
