// import { useState, useLocation, useNavigate } from 'react';
// import SubmissionSidebar from '../SubmissionSideBar/SubmissionSidebar';
// import MapComponent from '../Map/MapComponent';

// const MapSubmissionPage = ({ building, position }) => {
//   const [featureType, setFeatureType] = useState('');  // Shared state for feature type
//   const [clickedPosition, setClickedPosition] = useState(null);  // Shared state for map click
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [currBuilding, setCurrBuilding] = useState(null);
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const [position, setPosition] = useState(null);

//     useEffect(() => {
//         const building = location.state?.building;
//         if (building && building.location && building.location._lat && building.location._long) {
//             setCurrBuilding(building);
//             setPosition({
//                 lat: building.location._lat,
//                 lng: building.location._long
//             });
//         } else {
//             console.error("Invalid building data:", building);
//         }
//     }, [location.state, navigate]);

//     if (!currBuilding || !position) {
//         return <div>Loading... or Invalid building data. Please try searching again.</div>;
//     }

//   const handleMapClick = (newPosition) => {
//     setClickedPosition(newPosition);
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       {/* Sidebar to submit accessibility features */}
//       <SubmissionSidebar 
//         isOpen={true}
//         navbarHeight="56px"
//         building={building}
//         setFeatureType={setFeatureType}  // Pass function to update featureType
//         setClickedPosition={setClickedPosition}  // Optionally pass position to map click
//       />
      
//       {/* Map component to display markers */}
//       <MapComponent 
//         building={building} 
//         position={position} 
//         handleMapClick={handleMapClick}  // Function to handle map clicks
//         clickedPosition={clickedPosition}  // Share clicked position with the map
//         featureType={featureType}  // Pass featureType to the map to update markers
//       />
//     </div>
//   );
// };

// export default MapSubmissionPage;

// TESTTTTTTTTTTTTTTTTTTTT


{/* Reviews List 
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
</div> */}
