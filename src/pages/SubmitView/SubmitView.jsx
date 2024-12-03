// Submitting a new feature view
// SubmissionSidebar and MapComponent's parent component 
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SubmissionSidebar from '../../components/SubmissionSideBar/SubmissionSidebar';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer'
import MapComponent from '../../components/Map/MapComponent';

export const SubmitView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currBuilding, setCurrBuilding] = useState(null);
    const [position, setPosition] = useState(null);
    const [clickedPosition, setClickedPosition] = useState(null);  // State to track clicked position
    const [featureType, setFeatureType] = useState(null); // State to track feature type chosen by user

    useEffect(() => {
        const building = location.state?.building;
        if (building && building.location && building.location._lat && building.location._long) {
            setCurrBuilding(building);
            setPosition({
                lat: building.location._lat,
                lng: building.location._long
            });
        } else {
            console.error("Invalid building data:", building);
        }
    }, [location.state, navigate]);

    if (!currBuilding || !position) {
        return (
            <div className="alert alert-warning text-center" role="alert">
                Sorry, the location you search for is incorrect or is no longer available.
                Please try searching again.
            </div>
        );
    }

    return (
        <>
        <div className="d-flex flex-column vh-100">
            <NavBar />
            <div className="d-flex flex-grow-1">
                <SubmissionSidebar 
                    building={currBuilding} 
                    clickedPosition={clickedPosition} 
                    featureType={featureType}
                    setFeatureType={setFeatureType}  
                />
                <MapComponent 
                    building={currBuilding} 
                    position={position} 
                    handleMapClick={setClickedPosition} 
                    clickedPosition={clickedPosition}
                    featureType={featureType}
                />
            </div>
        </div>
        <Footer />
        </>
    );
};

export default SubmitView;