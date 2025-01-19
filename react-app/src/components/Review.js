import React, { useState } from 'react';
import './Review.css';

function Review() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [ratings, setRatings] = useState({
    overall: 0,
    visual: 0,
    auditory: 0,
    cognitive: 0,
    physical: 0
  });

  const handleRatingChange = (category, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [category]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const categories = ['visual', 'auditory', 'cognitive', 'physical'];
    const totalRatings = categories.reduce((sum, category) => sum + ratings[category], 0);
    const averageRating = totalRatings / categories.length;

    setRatings((prevRatings) => ({
      ...prevRatings,
      overall: averageRating,
    }));

    const reviewData = {
      text: description,
      location_id: "4778def0-76ec-4c5c-8657-91e5b7659ba7",
      user_id: name,
      accessibility_ratings: { ...ratings, overall: averageRating },
      title: title
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
            <label>
              {category.charAt(0).toUpperCase() + category.slice(1)}:
            </label>
            <div className="rating-group">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(category, star)}
                  className={`star-button ${ratings[category] >= star ? 'active' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
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

        <button type="submit" className="submit-button">
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default Review;
