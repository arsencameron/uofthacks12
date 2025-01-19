import React, { useState } from 'react';
import magnifying_glass from "../assets/magnifying-glass.svg";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    console.log("I searched")
    event.preventDefault();
    onSearch(searchTerm); // Triggers `handleSearch` in Home.js
  };

  return (
    <form className="search-bar" onSubmit={handleSearchSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          className="custom-input"
          placeholder="Search accessibility (e.g Robarts Library...)"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit" className="search-button">
          <img src={magnifying_glass} alt="Search" />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;