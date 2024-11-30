// Submitting a new feature view
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import SubmissionSidebar from '../../components/SubmissionSideBar/SubmissionSidebar';
import NavBar from '../../components/NavBar/NavBar';
import MapComponent from "../../components/Map/MapComponent";

export const SubmitView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currBuilding, setCurrBuilding] = useState(null);
    const [position, setPosition] = useState(null);
    const [clickedPosition, setClickedPosition] = useState(null);  // State to track clicked position
    const [featureType, setFeatureType] = useState(null);

    const handleMapClick = (position) => {
        setClickedPosition(position);
    };

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
        return <div>Loading... or Invalid building data. Please try searching again.</div>;
    }

    return (
        <div className="position-relative vh-100 vw-100">
            <NavBar />
            <div className="h-100 w-100">
                <SubmissionSidebar 
                    building={currBuilding} 
                    clickedPosition={clickedPosition} 
                    featureType={featureType}
                    setFeatureType={setFeatureType}  />
                <div>
                    <MapComponent 
                    building={currBuilding} 
                    position={position} 
                    handleMapClick={setClickedPosition} 
                    clickedPosition={clickedPosition}
                    featureType={featureType}/>
                </div>
            </div>
        </div>
    );
};

export default SubmitView;