import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '99.5%',
  height: '490px',
  borderRadius: '22px',
};

const center = {
  lat: 43.6532,
  lng: -79.3832,
};

function MapComponent({selectedPlace, setSelectedPlace}) {
  const mapRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  }

  const [locations, setLocations] = useState([]);

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
            placeId: place.place_id,
            fields: [
              'name',
              'formatted_address',
              'geometry',
              'rating',
              'opening_hours',
              'photos',
              'website',
              'types',
            ],
          };

          service.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
            if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
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
        }
      });
    }
  };
  // Fetch locations from Flask API
  useEffect(() => {
    fetch("http://127.0.0.1:5000/locations_coordinate") // Replace with your API URL
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => console.error("Error fetching locations:", error));

      if (mapRef.current && selectedPlace){
        const newCenter = { lat: selectedPlace.lat, lng: selectedPlace.lng };
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(15);
      }
  }, [selectedPlace]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedPlace ? {lat: selectedPlace.lat, lng: selectedPlace.lng} : center}
        zoom={14}
        onClick={handleMapClick}
        onLoad={onLoad}
      >
        {locations.map(({ latitude, longitude, name }, index) => {
          const lat = parseFloat(latitude);
          const lng = parseFloat(longitude);
          
          // Only render marker if coordinates are valid numbers
          return !isNaN(lat) && !isNaN(lng) ? (
            <Marker
              key={index}
              position={{ lat, lng }}
              title={name}
            />
          ) : null;
        })}
        {selectedPlace && (
              <Marker position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }} />
          )}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;