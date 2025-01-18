import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '1270px',
  height: '650px'
};

const center = {
  lat: 43.6532,
  lng: -79.3832
};

function MapComponent() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const place = results[0];
        setSelectedPlace({
          lat,
          lng,
          name: place.formatted_address || 'Selected Location',
          address: place.formatted_address || 'No address available'
        });
      }
    });
  };

  return (
    <div className="google-map-container">
      <div className="map-wrapper">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onClick={handleMapClick}
          >
            {selectedPlace && (
              <Marker position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }} />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      {selectedPlace && (
        <div className="location-info">
          <h2>{selectedPlace.name}</h2>
          <p>{selectedPlace.address}</p>
        </div>
      )}
    </div>
  );
}

export default MapComponent;