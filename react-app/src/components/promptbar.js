import React, { useState } from 'react';
import magnifying_glass from "../assets/enter.svg";

function PromptBar({ onPrompt }) {
  const [promptTerm, setPromptTerm] = useState('');

  const handlePromptChange = (event) => {
    setPromptTerm(event.target.value);
  };

  const handlePromptSubmit = (event) => {
    event.preventDefault();
    onPrompt(promptTerm);
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