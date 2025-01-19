// RightSection.js
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
        </div>
    );
}

export default RightSection;