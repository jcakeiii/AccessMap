// RoutingView for users to look for routes. Child components: MapComponent, RoutingSidebar 
import { useState, useEffect } from 'react';
import RoutingSidebar from '../../components/RoutingSidebar/RoutingSidebar';
import MapComponent from '../../components/Map/MapComponent';
import NavBar from '../../components/NavBar/NavBar';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const RoutingView = () => {
  const [originPlaceId, setOriginPlaceId] = useState(null);
  const [destinationPlaceId, setDestinationPlaceId] = useState(null);
  const [travelMode, setTravelMode] = useState(google.maps.TravelMode.WALKING);
  const [userLocation, setUserLocation] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // Get user's current location to show the user's current location while searching for routes 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newUserLocaiton = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(newUserLocaiton);
                setPosition(newUserLocaiton);
                console.log(newUserLocaiton);

            },
            (error) => {
                console.error("Error getting user location:", error);
                toast.error("Error getting your location. Please check if location services have been enabled in your browser.", {
                    position: "top-center"
                  });
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        toast.error("Geolocation is not supported by your browser :(", {
            position: "top-center"
          });
    }
}, []);

  return (
    <div className="position-relative h-100 w-100">
      <NavBar/>
      <div className="content-below-navbar h-100 w-100">
        
        {/* Map component to display directions */}
        {userLocation && (
        <MapComponent
          position={userLocation}
          originPlaceId={originPlaceId}
          destinationPlaceId={destinationPlaceId}
          travelMode={travelMode}/> )}
        
        {/* Sidebar to set origin, destination, and travel mode */}
        <RoutingSidebar
          setOriginPlaceId={setOriginPlaceId}
          setDestinationPlaceId={setDestinationPlaceId}
          setTravelMode={setTravelMode}/>
        
        <ToastContainer/>
      </div>
    </div>
  );
};

export default RoutingView;