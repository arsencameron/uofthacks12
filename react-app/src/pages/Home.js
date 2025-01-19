import React, { useState } from 'react';
import LeftSection from '../components/LeftSection';
import RightSection from '../components/RightSection';
import './Home.css';
import Review from '../components/Review'
import axios from 'axios';

function Home() {
    const [selectedPlace, setSelectedPlace] = useState(null); // Centralized state for selected place
    const [activeTab, setActiveTab] = useState('search'); // Manage active tab (search or generate)
    const [showReview, setShowReview] = useState(false);
    const [sortedLocations, setSortedLocations] = useState([]);

    const fetchGooglePlaceDetails = (name) => {
        handleSearch(name);
    };


    const handleSearch = (searchTerm) => {
        if (!searchTerm) return;

        const service = new window.google.maps.places.PlacesService(document.createElement('div'));

        const queryRequest = {
            query: searchTerm,
            fields: ['name', 'formatted_address', 'geometry', 'photos', 'place_id', 'types'],
        };

        service.findPlaceFromQuery(queryRequest, async (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                const place = results[0];

                const detailsRequest = {
                    placeId: place.place_id,
                    fields: ['name', 'formatted_address', 'geometry', 'rating', 'opening_hours', 'photos', 'website', 'types'],
                };

                service.getDetails(detailsRequest, async (placeDetails, detailsStatus) => {
                    if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                        const selectedPlace = {
                            lat: placeDetails.geometry.location.lat(),
                            lng: placeDetails.geometry.location.lng(),
                            name: placeDetails.name,
                            address: placeDetails.formatted_address,
                            rating: placeDetails.rating,
                            website: placeDetails.website || null,
                            openingHours: placeDetails.opening_hours
                                ? placeDetails.opening_hours.weekday_text
                                : 'No opening hours available',
                            types: placeDetails.types ? placeDetails.types.join(', ') : null,
                            photos: placeDetails.photos
                                ? placeDetails.photos.map((photo) => photo.getUrl())
                                : [],
                        };

                        try {
                            // Fetch locations from the database
                            const response = await axios.get("http://127.0.0.1:5000/locations");
                            const locations = response.data;

                            // Find a matching location
                            const matchingLocation = locations.find(
                                (location) =>
                                    location.name.toLowerCase() === selectedPlace.name.toLowerCase()
                            );

                            if (matchingLocation) {
                                // Add additional data to `selectedPlace`
                                selectedPlace.accessibilityRatings = matchingLocation.accessibility_ratings;
                                selectedPlace.location_id = matchingLocation.location_id;

                                // Fetch the summary for the matching location
                                const summaryResponse = await axios.get(
                                    `http://127.0.0.1:5000/locations/${matchingLocation.location_id}`
                                );
                                selectedPlace.summary = summaryResponse.data.summary;
                            } else {
                                console.log("Not found in database");
                            }
                            setSelectedPlace(selectedPlace);
                        } catch (error) {
                            console.error("Error fetching location data or summary:", error);
                            setSelectedPlace(selectedPlace);
                        }
                    } else {
                        console.error("Failed to fetch place details:", detailsStatus);
                    }
                });
            } else {
                console.error("Place not found:", status);
            }
        });
    };

    const handleWriteReviewClick = () => {
        setShowReview(true);
      };

    const handlePrompt = (locations) => {
        setSortedLocations(locations);
    };
    return (
        <div className="home-container">
            <LeftSection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleSearch={handleSearch} // Pass search handler
                handlePrompt={handlePrompt} // Pass prompt handler
                setSelectedPlace={setSelectedPlace} // Pass map click handler
                selectedPlace={selectedPlace}
            />
            <RightSection
                sortedLocations={sortedLocations}
                selectedPlace={selectedPlace} // Pass selectedPlace
                setSelectedPlace={setSelectedPlace} // Allow updates to selectedPlace
                handleWriteReviewClick={handleWriteReviewClick}
            />
            {/* {showReview ? (
                <Review />
            ) : (
                <RightSection handleWriteReviewClick={handleWriteReviewClick} />
            )} */}
        </div>
    );
}

export default Home;
