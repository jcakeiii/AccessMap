import { Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import MapComponent from "../../components/Map/MapComponent";
import MapSideBar from "../../components/MapSideBar/MapSideBar";
import NavBar from '../../components/NavBar/NavBar';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const MyLocationView = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [position, setPosition] = useState(null);

    useEffect(() => {
        // Get user's current location
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
            <NavBar />
            <div className="content-below-navbar h-100 w-100">
                {/* Renders only when userLocation is not null */}
                {userLocation && (
                <MapComponent building={null} position={userLocation} userLocation={userLocation}/> )}

                {/* Sidebar component */}
                <MapSideBar title="Features at This Location" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
                </MapSideBar>

                {/* Toggle button for the sidebar */}
                {!sidebarOpen && (
                    <Button
                        variant="light"
                        className="position-absolute top-0 start-0 m-2 shadow"
                        style={{ zIndex: 1000 }}
                        onClick={() => setSidebarOpen(true)}>
                        ☰
                    </Button>
                )}
            </div>
            <ToastContainer/>
        </div>
    );
};


export default MyLocationView; 