import React from 'react';
import './Loading.css';
import wheelchair from '../assets/wheelchair.gif';

function Loading() {
  return (
    <div className="loading-container">
      <img src={wheelchair} alt="Loading" className="loading-logo" />
    </div>
  );
}

export default Loading;