import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { Button } from 'react-bootstrap';
import MapSideBar from '../../components/MapSideBar/MapSideBar';
import NavBar from '../../components/NavBar/NavBar';
import MapComponent from '../../components/Map/MapComponent';

export const MapView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currBuilding, setCurrBuilding] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const building = location.state?.building;
        console.log("Received state:", location.state);
        console.log("Building data:", building);
        if (building && building.location && building.location._lat && building.location._long) {
            setCurrBuilding(building);
            setPosition({
                lat: building.location._lat,
                lng: building.location._long
            });
            console.log("Setting position:", position)
        } else {
            console.error("Invalid building data:", building);
            // navigate back to the search page or show an error message?
        }
    }, [location.state, navigate]);

    if (!currBuilding || !position) {
        return <div>Loading... or Invalid building data. Please try searching again.</div>;
    }

    return (
        <div className="position-relative h-100 w-100">
            <NavBar />
            <div className="content-below-navbar h-100 w-100">
                <MapComponent building={currBuilding} position={position} />

                {/* Sidebar component */}
                <MapSideBar title="Features at This Location" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
                    <ul>
                        <li>Elevator</li>
                        <li>Ramp</li>
                        <li>Accessible Restrooms</li>
                    </ul>
                </MapSideBar>

                {/* Toggle button for the sidebar */}
                {!sidebarOpen && (
                    <Button
                        variant="light"
                        className="position-absolute top-0 start-0 m-2 shadow"
                        style={{ zIndex: 1000 }}
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </Button>
                )}
            </div>
        </div>
    );
};

export default MapView;