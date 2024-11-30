import React, { useState } from 'react';
import RoutingSidebar from '../../components/RoutingSidebar/RoutingSidebar';
import MapComponent from '../../components/Map/MapComponent';
import NavBar from '../../components/NavBar/NavBar';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const RoutingView = () => {
  const [originPlaceId, setOriginPlaceId] = useState(null);
  const [destinationPlaceId, setDestinationPlaceId] = useState(null);
  const [travelMode, setTravelMode] = useState(google.maps.TravelMode.WALKING);

  // Default map position
  const pos = {
    lat: 39.639480469488504, 
    lng: -86.86351252156922
  };

  return (
    <div className="position-relative h-100 w-100">
      <NavBar />
      <div className="content-below-navbar h-100 w-100">
        
        {/* Map component to display directions */}
        <MapComponent
          position={pos}
          originPlaceId={originPlaceId}
          destinationPlaceId={destinationPlaceId}
          travelMode={travelMode} 
        />
        
        {/* Sidebar to set origin, destination, and travel mode */}
        <RoutingSidebar
          setOriginPlaceId={setOriginPlaceId}
          setDestinationPlaceId={setDestinationPlaceId}
          setTravelMode={setTravelMode}
        />
        
        {/* Toast notifications */}
        <ToastContainer/>
      </div>
    </div>
  );
};

export default RoutingView;
