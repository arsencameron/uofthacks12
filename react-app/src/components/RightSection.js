import React, { useState } from 'react';
import './RightSection.css';
import sampleImage from '../assets/university-of-toronto-mississauga_hero.png'; // Import the image

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

  return (
    <section className="right-section">
      <img src={sampleImage} alt="Location" className="location-image" /> {/* Use the imported image */}
      <div className="location-info">
        <h1 className="location-name">Sample Location</h1>
        <h2 className="location-address">123 Sample Street</h2>
        <p className="location-description">This is a sample description of the location. It provides detailed information about the location's features and amenities.</p>
        <div className="rating-section">
          <span className="overall-rating">4.5</span>
          <Star filled={true} />
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
      <h3 className="reviews-summary-title">Reviews Summary✨</h3>
      <p className="reviews-summary">This is a summary of the reviews. It provides an overview of what people think about the location.</p>
      <button className="read-reviews-button">Read Reviews</button>
    </section>
  );
};

export default RightSection;