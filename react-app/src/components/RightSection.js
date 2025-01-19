import React from 'react';

function RightSection({ selectedPlace }) {
    if (!selectedPlace) {
        return (
            <div className="right-section">
                <h2>Select a location on the map</h2>
            </div>
        );
    }

    return (
        <div className="right-section">
            <h2>Location Details</h2>
            <p><strong>Name:</strong> {selectedPlace.name}</p>
            <p><strong>Address:</strong> {selectedPlace.address}</p>
            {selectedPlace.rating && (
                <p><strong>Rating:</strong> {selectedPlace.rating} / 5</p>
            )}
            {selectedPlace.website && (
                <p>
                    <strong>Website:</strong>{' '}
                    <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
                        {selectedPlace.website}
                    </a>
                </p>
            )}
            {selectedPlace.types && (
                <p><strong>Place Types:</strong> {selectedPlace.types}</p>
            )}
            {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                <div>
                    <strong>Photos:</strong>
                    <div className="photos">
                        {selectedPlace.photos.map((photoUrl, index) => (
                            <img
                                key={index}
                                src={photoUrl}
                                alt={`Place photo ${index + 1}`}
                                style={{ width: '100px', margin: '5px' }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RightSection;
