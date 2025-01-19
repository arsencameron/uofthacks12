import React, { useState } from 'react';
import './RightSection.css';

const RightSection = ({ selectedPlace }) => {
    const [showMoreTags, setShowMoreTags] = useState(false);

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
                {selectedPlace.rating && (
                    <div className="rating-section">
                        <span className="overall-rating">{selectedPlace.rating}</span>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} filled={i < Math.round(selectedPlace.rating)} />
                        ))}
                    </div>
                )}
                {selectedPlace.summary && (
                    <>
                        <h3 className="reviews-summary-title">Accessibility Summary✨</h3>
                        <p className="reviews-summary">{selectedPlace.summary}</p>
                    </>
                )}
                {selectedPlace.accessibilityRatings && (
                    <div className="star-ratings">
                        {Object.entries(selectedPlace.accessibilityRatings).map(([category, rating]) => (
                            <div key={category} className="rating">
                                <span className="rating-title">{category}</span>
                                <span className="rating-value">{rating}</span>
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} filled={i < rating} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default RightSection;
