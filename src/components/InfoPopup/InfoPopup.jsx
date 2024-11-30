import { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { InfoWindow } from "@vis.gl/react-google-maps";
import { Carousel } from "react-bootstrap";
import { Star } from 'lucide-react';
import FeatureReview from '../FeatureReview/FeatureReview'

const InfoPopup = ({ position, feature, onClose }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
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
        className="w-4 h-4 text-warning fill-warning"
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

          {/* Rating Display */}
          <div className="px-3 py-2 d-flex align-items-center">
            <div className="d-flex me-2">
              {renderStars()}
            </div>
            <span className="text-muted">5.0</span>
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
              <FeatureReview featureId={feature.id} onReviewSubmit={handleReviewSubmit} />
            </div>

            {/* Reviews List */}
            {reviews.length > 0 && (
              <div className="mt-4">
                <h5 className="border-bottom pb-2 mb-3">
                  Reviews
                  <span className="badge bg-secondary ms-2">{reviews.length}</span>
                </h5>
                <div className="review-list">
                  {reviews.map((review, index) => (
                    <div key={index} className="card mb-3 border-light bg-light">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="text-warning">{renderStars()}</div>
                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="card-text mb-0">{review.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Close"
        />
      </div>
    </InfoWindow>
  );
};

export default InfoPopup;