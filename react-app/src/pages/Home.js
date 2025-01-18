import React from 'react';
import SearchBar from '../components/searchbar';
import GoogleMap from '../components/GoogleMap';

function Home() {
  const handleSearch = (searchTerm) => {
    console.log('Search Term:', searchTerm);
    // Add your search logic here
  };

  return (
    <div className="App">
      <header className="App-header">
        Find your location
      </header>
      <SearchBar onSearch={handleSearch} />
      <GoogleMap />
    </div>
  );
}

export default Home;