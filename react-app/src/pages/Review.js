import React, { useState } from 'react';
import './Review.css';

function Review() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission logic here
    console.log('Review submitted:', { title, description, name, date });
  };

  return (
    <div className="review-container">
      <div className="review-left">
        <h2>Location Name</h2>
        <p>Address: 123 Main St, City, Country</p>
        <div className="ratings">
          <div className="rating">
            <span>Overall: </span>
            <span>⭐⭐⭐⭐⭐</span>
          </div>
          <div className="rating">
            <span>Visual: </span>
            <span>⭐⭐⭐⭐⭐</span>
          </div>
          <div className="rating">
            <span>Auditory: </span>
            <span>⭐⭐⭐⭐⭐</span>
          </div>
          <div className="rating">
            <span>Cognitive: </span>
            <span>⭐⭐⭐⭐⭐</span>
          </div>
          <div className="rating">
            <span>Physical: </span>
            <span>⭐⭐⭐⭐⭐</span>
          </div>
        </div>
      </div>
      <div className="review-right">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title for Review:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
}

export default Review;