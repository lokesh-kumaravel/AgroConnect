import React, { useState, useEffect } from 'react';
import axios from "../axios";
import 'bootstrap/dist/css/bootstrap.min.css';
const ReviewComponent = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/products/${productId}/reviews`);
        setReviews(response.data); // No need to call .json() here
      } catch (error) {
        setError('Failed to fetch reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
}, [productId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newReview = { rating, reviewText };
    
    try {
      const response = await axios.post(`/products/${productId}/reviews`, newReview);
      const savedReview = response.data;
      setReviews([...reviews, savedReview]);
      setRating(0);
      setReviewText('');
    } catch (error) {
      setError('Error submitting review. Please try again.');
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <div>
      <h3 className="mb-4">Reviews</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Rating:</label>
          <select 
            className="form-select" 
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value="0">Select rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>{star}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Review:</label>
          <textarea
            className="form-control"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Review</button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.review_id} className="border p-3 mb-3">
                <h5>Rating: {review.rating}</h5>
                <p style={{color:'red'}}>{review.reviewText}</p>
                <small className="text-muted">{new Date(review.timestamp).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <div className="alert alert-info">No reviews yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;

// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ReviewComponent = ({ productId }) => {
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState('');

//   // Fetch reviews when the component mounts
//   useEffect(() => {
//     const fetchReviews = async () => {
//       const response = await fetch(`/api/products/${productId}/reviews`);
//       const data = await response.json();
//       setReviews(data);
//     };
    
//     fetchReviews();
//   }, [productId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const newReview = { rating, reviewText };
//     const response = await fetch(`/api/products/${productId}/reviews`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newReview),
//     });

//     if (response.ok) {
//       const savedReview = await response.json();
//       setReviews([...reviews, savedReview]);
//       setRating(0);
//       setReviewText('');
//     } else {
//       console.error('Error submitting review');
//     }
//   };

//   return (
//     <div>
//       <h3 className="mb-4">Reviews</h3>

//       <form onSubmit={handleSubmit} className="mb-4">
//         <div className="mb-3">
//           <label className="form-label">Rating:</label>
//           <select 
//             className="form-select" 
//             value={rating} 
//             onChange={(e) => setRating(Number(e.target.value))}
//           >
//             <option value="0">Select rating</option>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <option key={star} value={star}>{star}</option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Review:</label>
//           <textarea
//             className="form-control"
//             value={reviewText}
//             onChange={(e) => setReviewText(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">Submit Review</button>
//       </form>

//       <div>
//         {reviews.length > 0 ? (
//           reviews.map((review) => (
//             <div key={review.review_id} className="border p-3 mb-3">
//               <h5>Rating: {review.rating}</h5>
//               <p>{review.review_text}</p>
//               <small className="text-muted">{new Date(review.timestamp).toLocaleString()}</small>
//             </div>
//           ))
//         ) : (
//           <div className="alert alert-info">No reviews yet.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewComponent;
