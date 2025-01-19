import React, { useState } from 'react';
import './Review.css';

function Review() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [ratings, setRatings] = useState({
    overall: 0,
    visual: 0,
    auditory: 0,
    cognitive: 0,
    physical: 0
  });
  
  const StarRating = ({ category, rating, onRatingChange }) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'active' : ''}`}
            onClick={() => onRatingChange(category, star)}
          >
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  const handleRatingChange = (category, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [category]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reviewData = {
      text: description,
      location_id: "4778def0-76ec-4c5c-8657-91e5b7659ba7", // Replace with actual location ID
      user_id: "user-id-placeholder", // Replace with actual user ID
      accessibility_ratings: ratings,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert(`Review added successfully! Review ID: ${data.review_id}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit the review. Please try again.');
    }
  };


  return (
<div>
<form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="title">Title:</label>
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
    {['visual', 'auditory', 'cognitive', 'physical'].map((category) => (
      <div key={category} className="form-group">
        <label>{category.charAt(0).toUpperCase() + category.slice(1)}:</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${ratings[category] >= star ? 'active' : ''}`}
            onClick={() => handleRatingChange(category, star)}
          >
            {ratings[category] >= star ? '★' : '☆'}
          </span>
        ))}
      </div>
    ))}
    <button type="submit">Submit Review</button>
  </form>
</div>
  );
}

export default Review;