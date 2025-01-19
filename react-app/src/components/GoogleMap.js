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

      // Perform nearby search
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
          const place = results[0];

          // Fetch more details about the selected place
          const detailsRequest = {
            placeId: place.place_id, // Use the Place ID from the result
            fields: [
              'name',
              'formatted_address',
              'geometry',
              'rating',
              'opening_hours',
              'photos',
              'website',
              'types',
            ], // Specify the fields you want to fetch
          };

          service.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
            if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
              // Update state with detailed place information
              setSelectedPlace({
                lat,
                lng,
                name: placeDetails.name,
                address: placeDetails.formatted_address,
                rating: placeDetails.rating,
                website: placeDetails.website,
                openingHours: placeDetails.opening_hours
                    ? placeDetails.opening_hours.weekday_text
                    : 'No opening hours available',
                types: placeDetails.types.join(', '),
                photos: placeDetails.photos
                    ? placeDetails.photos.map((photo) => photo.getUrl())
                    : [],
              });
            } else {
              console.error('Failed to fetch place details:', detailsStatus);
            }
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
