import React, { useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '99.5%',
  height: '650px',
};

const center = {
  lat: 43.6532,
  lng: -79.3832,
};

function MapComponent({ setSelectedPlace }) {
  const mapRef = useRef(null); // Reference to store the map instance

  const onLoad = (map) => {
    mapRef.current = map; // Save the map instance
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (mapRef.current) {
      const service = new window.google.maps.places.PlacesService(mapRef.current);

      const request = {
        location: { lat, lng },
        radius: 50,
      };

      // Perform nearby search on every click
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
          const place = results[0];
          setSelectedPlace({
            lat,
            lng,
            name: place.name || 'Selected Location',
            address: place.vicinity || 'No address available',
          });
        } else {
          // Handle no places found
          setSelectedPlace({
            lat,
            lng,
            name: 'No places found',
            address: 'No address available',
          });
        }
      });
    }
  };

  return (
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onClick={handleMapClick}
            onLoad={onLoad} // Capture map instance
        />
      </LoadScript>
  );
}

export default MapComponent;
