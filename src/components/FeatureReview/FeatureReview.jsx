// Review feature, including rating and writing a text review 
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { Star } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { Button } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const FeatureReview = ({ feature, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);


    useEffect(() => {
        const fetchReviews = async () => {
          const docRef = doc(db, 'accessibilityFeatures', feature.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().reviews) {
            const fetchedReviews = docSnap.data().reviews;
                setReviews(fetchedReviews);
                
                // Calculate average rating
                const sum = fetchedReviews.reduce((acc, review) => acc + review.rating, 0);
                const avg = (sum / fetchedReviews.length).toFixed(1);
                setAverageRating(avg);
          }
        };
        
        fetchReviews();
      }, [feature.id]);

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const renderStar = (value) => {
        const filled = (hoverRating || rating) >= value;
        return (
            <Star
                key={value}
                style={{ 
                    width: '1.5rem', 
                    height: '1.5rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                }}
                className={`me-1 ${
                    filled ? 'text-warning' : 'text-secondary'
                }`}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingClick(value)}
            />
        );
    };

    const handleReviewChange = (e) => setReviewText(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const review = { 
            rating, 
            text: reviewText, 
            createdAt: new Date() 
        };
        
        try {
            console.log("Feature ID:", feature.id)
            const docRef = doc(db, 'accessibilityFeatures', feature.id);
            await updateDoc(docRef, {
                reviews: arrayUnion(review)
            });
            toast.success("Review submitted successfully!");
            setRating(0);
            setReviewText('');
            setReviews(prev => [...prev, review]);
            onReviewSubmit(review);
        } catch (error) {
            toast.error("Failed to submit review. Please try again.");
            console.log(error);
            setRating(0);
            setReviewText('');
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <ToastContainer />
                    
                    {/* Rating section */}
                    <div className="text-center mb-4">
                        <h5 className="card-title fw-bold mb-3">Rate this Feature</h5>
                        <div className="d-flex justify-content-center mb-2">
                            {[1, 2, 3, 4, 5].map(value => renderStar(value))}
                        </div>
                        {(hoverRating || rating) ? (
                            <span className="badge bg-light text-dark">
                                {hoverRating || rating} out of 5
                            </span>
                        ) : (
                            <small className="text-muted">Select a rating</small>
                        )}
                    </div>

                    {/* Review text section */}
                    <div className="mb-4">
                        <label for="reviewText" className="form-label fw-semibold mb-2">
                            Write your review:
                        </label>
                        <textarea
                            id="reviewText"
                            className="form-control"
                            rows="4"
                            placeholder="Share your experience..."
                            value={reviewText}
                            onChange={handleReviewChange}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid gap-2">
                        <Button type="submit" className="btn btn-primary" disabled={!rating || !reviewText.trim()}>
                            Submit Review
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeatureReview;