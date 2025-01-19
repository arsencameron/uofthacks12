import React, { useState } from 'react';
import magnifying_glass from "../assets/enter.svg";

function PromptBar({ onPrompt }) {
  const [promptTerm, setPromptTerm] = useState('');

  const handlePromptChange = (event) => {
    setPromptTerm(event.target.value);
  };

  const handlePromptSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptTerm }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const sortedLocations = await response.json();
      onPrompt(sortedLocations); // Pass data to parent
    } catch (error) {
      console.error("Error fetching sorted locations:", error);
    }
  };


  return (
    <form className="prompt-bar" onSubmit={handlePromptSubmit}>
      <div className="prompt-input-container">
        <input
          type="text"
          className="custom-input"
          placeholder="Generate places (e.g I am in a wheelchair, find me suitable locations...)"
          value={promptTerm}
          onChange={handlePromptChange}
        />
        <button type="submit" className="prompt-button">
          <img src={magnifying_glass} alt="Enter" />
        </button>
      </div>
    </form>
  );
}

export default PromptBar;