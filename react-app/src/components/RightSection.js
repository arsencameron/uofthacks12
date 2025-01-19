const RightSection = ({ selectedPlace }) => {
    if (!selectedPlace) {
        return (
            <section className="right-section">
                <h2>Select a location or search for one</h2>
            </section>
        );
    }

    return (
        <section className="right-section">
            <img
                src={selectedPlace.photos && selectedPlace.photos[0] ? selectedPlace.photos[0] : 'https://via.placeholder.com/150'}
                alt={selectedPlace.name}
                className="location-image"
            />
            <div className="location-info">
                <h1 className="location-name">{selectedPlace.name}</h1>
                <h2 className="location-address">{selectedPlace.address}</h2>
                {selectedPlace.rating && (
                    <p className="location-rating">
                        <strong>Rating:</strong> {selectedPlace.rating} / 5
                    </p>
                )}
                {selectedPlace.website && (
                    <p>
                        <strong>Website:</strong>{' '}
                        <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
                            {selectedPlace.website}
                        </a>
                    </p>
                )}
                {Array.isArray(selectedPlace.openingHours) && (
                    <div>
                        <strong>Opening Hours:</strong>
                        <ul>
                            {selectedPlace.openingHours.map((hour, index) => (
                                <li key={index}>{hour}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {selectedPlace.types && (
                    <p><strong>Types:</strong> {selectedPlace.types}</p>
                )}
            </div>
        </section>
    );
};

export default RightSection;