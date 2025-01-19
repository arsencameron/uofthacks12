import React, { useState } from 'react';
import magnifying_glass from "../assets/magnifying-glass.svg";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="search-bar" onSubmit={handleSearchSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search..."
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