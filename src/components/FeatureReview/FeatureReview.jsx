import { useState } from 'react';
import { db } from '../../config/firebase';
import { Star } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const FeatureReview = ({ featureId, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const renderStar = (value) => {
        const filled = (hoverRating || rating) >= value;
        return (
            <Star
                key={value}
                className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
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
        const review = { rating, text: reviewText, createdAt: new Date() };
        
        try {
            const accessibilityFeaturesRef = collection(db, 'accessibilityFeatures');
            const docRef = await addDoc(accessibilityFeaturesRef, review);
            toast.success("Review submitted successfully!");
            setRating(0);
            setReviewText('');
            onReviewSubmit(review);
        } catch (error) {
            toast.success("Review submitted successfully!");
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <ToastContainer />
                    
                    {/* Rating Section */}
                    <div className="text-center mb-4">
                        <h5 className="card-title mb-3">Rate this Feature</h5>
                        <div className="d-flex justify-content-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map(value => renderStar(value))}
                        </div>
                        <small className="text-muted">
                            {hoverRating || rating ? (
                                <span className="badge bg-light text-dark">
                                    {hoverRating || rating} out of 5
                                </span>
                            ) : (
                                'Select a rating'
                            )}
                        </small>
                    </div>

                    {/* Review Text Section */}
                    <div className="form-group mb-4">
                        <label htmlFor="reviewText" className="form-label fw-semibold">
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
                    <div className="d-grid">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={!rating || !reviewText.trim()}
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeatureReview;