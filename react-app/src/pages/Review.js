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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Review submitted:', { title, description, name, date, ratings });
  };

  const handleRatingChange = (category, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [category]: value
    }));
  };



  return (
<div>
  <div className="ratings">
    {['visual', 'auditory', 'cognitive', 'physical'].map((category) => (
      <div className="rating" key={category}>
        <span className="rating-label">{category.charAt(0).toUpperCase() + category.slice(1)}:</span>
        <StarRating
          category={category}
          rating={ratings[category]}
          onRatingChange={handleRatingChange}
        />
      </div>
    ))}
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
      <button type="submit">Submit Review</button>
    </form>
  </div>
</div>
  );
}

export default Review;