import { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { InfoWindow } from "@vis.gl/react-google-maps";
import { Carousel } from "react-bootstrap";
import { Star } from 'lucide-react';
import FeatureReview from '../FeatureReview/FeatureReview'

// pass current feature on info popup to feature review component
const InfoPopup = ({ position, feature, onClose }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const storage = getStorage();

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      setError(null);
      setImageUrls([]);

      if (!feature?.imageUrl || !Array.isArray(feature.imageUrl)) {
        setIsLoading(false);
        return;
      }

      try {
        const urls = [];
        for (const imagePath of feature.imageUrl) {
          try {
            const storageRef = ref(storage, imagePath);
            const url = await getDownloadURL(storageRef);
            urls.push(url);
          } catch (e) {
            console.error(`Error fetching image ${imagePath}:`, e);
          }
        }
        setImageUrls(urls);
      } catch (error) {
        console.error("Error in image fetching process:", error);
        setError("Failed to load images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [feature, storage]);

  useEffect(() => {
    const fetchReviews = async () => {
        const docRef = doc(db, 'accessibilityFeatures', feature.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().reviews) {
            const fetchedReviews = docSnap.data().reviews;
            setReviews(fetchedReviews);
            
            // Calculate average rating
            const sum = fetchedReviews.reduce((acc, review) => acc + review.rating, 0);
            const avg = fetchedReviews.length > 0 
                ? (sum / fetchedReviews.length).toFixed(1)
                : 0;
            setAverageRating(avg);
        }
    };
    
    fetchReviews();
}, [feature.id]);

  const handleReviewSubmit = (newReview) => {
    setReviews(prevReviews => [...prevReviews, newReview]);
  };

  if (!position) { return null; }

  const nameDisplay = (feature) => {
    const displayNames = {
      accessibleDoor: "Accessible Door",
      elevator: "Elevator",
      mainEntrance: "Main Entrance",
      singleRestroom: "Single Restroom"
    };
    return displayNames[feature.type] || "";
  };

  const renderStars = () => {
    return Array(5).fill(0).map((_, index) => (
        <Star
            key={index}
            className={`${
                index < Math.round(averageRating) 
                    ? 'text-warning' 
                    : 'text-secondary'
            }`}
            size={16}
        />
    ));
};

  return (
    <InfoWindow position={position} onClose={onClose}>
      <div className="card border-0" style={{ maxWidth: "400px" }}>
        {/* Header */}
        <div className="card-header bg-primary text-white py-3">
          <h2 className="h4 mb-0 d-flex align-items-center">
            <i className="bi bi-geo-alt-fill me-2"></i>
            {nameDisplay(feature)}
          </h2>
        </div>

        <div className="card-body p-0">
          {/* Loading State */}
          {isLoading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {/* Image Carousel */}
          {!isLoading && imageUrls.length > 0 && (
            <Carousel className="mb-3">
              {imageUrls.map((url, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={url}
                    alt={`Feature image ${index + 1}`}
                    style={{ 
                      height: '250px', 
                      objectFit: 'cover',
                      borderRadius: '0'
                    }}
                  />
                  <Carousel.Caption className="bg-dark bg-opacity-50 rounded">
                    <p className="mb-0">Image {index + 1} of {imageUrls.length}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          )}

          {/* Rating display */}
          <div className="px-3 py-2 d-flex align-items-center">
            <div className="d-flex me-2">
                {renderStars()}
            </div>
            <span className="text-muted">
                {averageRating > 0 ? averageRating : 'No ratings'}
                {reviews.length > 0 && ` (${reviews.length})`}
            </span>
        </div>

          {/* Description */}
          <div className="p-3 pt-0">
            <h5 className="border-bottom pb-2 mb-3">Description</h5>
            {feature?.description ? (
              <p className="text-muted mb-4">{feature.description}</p>
            ) : (
              <p className="text-muted fst-italic mb-4">No description available</p>
            )}

            {/* Review Form */}
            <div className="mb-4">
              <FeatureReview feature={feature} onReviewSubmit={handleReviewSubmit} />
            </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
        />
      </div>
    </div>
  </div>
    </InfoWindow>
  );
};

export default InfoPopup;