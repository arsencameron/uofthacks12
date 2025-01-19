import React, { useState } from 'react';
import './RightSection.css';

const RightSection = () => {
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

  console.log('accessibilityTags:', accessibilityTags);

  return (
    <section className="right-section">
      <img src="https://via.placeholder.com/150" alt="Location" className="location-image" />
      <div className="location-info">
        <h1 className="location-name">Sample Location</h1>
        <h2 className="location-address">123 Sample Street</h2>
        <p className="location-description">This is a sample description of the location. It provides detailed information about the location's features and amenities.</p>
        <div className="rating-section">
          <span className="overall-rating">4.5</span>
          <span className="star">&#9733;</span>
          <p className="number-of-reviews">100 reviews</p>
        </div>
        <button className="write-review-button">Write a Review</button>
      </div>
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
      <div className="star-ratings">
        <div className="rating">
          <span className="rating-title">Physical</span>
          <span className="rating-value">4</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < 4 ? 'filled' : ''}`}>&#9733;</span>
            ))}
          </div>
        </div>
        <div className="rating">
          <span className="rating-title">Auditory</span>
          <span className="rating-value">3</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < 3 ? 'filled' : ''}`}>&#9733;</span>
            ))}
          </div>
        </div>
        <div className="rating">
          <span className="rating-title">Visual</span>
          <span className="rating-value">5</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < 5 ? 'filled' : ''}`}>&#9733;</span>
            ))}
          </div>
        </div>
        <div className="rating">
          <span className="rating-title">Cognitive</span>
          <span className="rating-value">2</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < 2 ? 'filled' : ''}`}>&#9733;</span>
            ))}
          </div>
        </div>
      </div>
      <h3 className="reviews-summary-title">Reviews Summary✨</h3>
      <p className="reviews-summary">This is a summary of the reviews. It provides an overview of what people think about the location.</p>
      <button className="read-reviews-button">Read Reviews</button>
    </section>
  );
};

export default RightSection;