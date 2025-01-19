import React, { useState } from 'react';
import './Review.css';

function Review() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ratings, setRatings] = useState({
    visual: 0,
    auditory: 0,
    cognitive: 0,
    physical: 0,
  });

  const handleRatingChange = (category, star) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: star,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      name,
      title,
      description,
      ratings,
    };
    // Submit the review data
  };

  return (
    <div className="review-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name (Optional):</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label htmlFor="description">Review:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Review;