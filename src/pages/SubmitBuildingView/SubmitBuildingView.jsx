import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import MapComponent from "../../components/Map/MapComponent";
import SubmitBuildingSidebar from "../../components/SubmitBuildingSidebar/SubmitBuildingSidebar";

export const SubmitBuildingView = () => {
    const navigate = useNavigate();
    const [clickedPosition, setClickedPosition] = useState(null);  // Track the clicked position

    const handleMapClick = (position) => {
        setClickedPosition(position);
    };

    return (
        <div className="position-relative vh-100 vw-100">
            <NavBar />
            <div className="h-100 w-100 d-flex">
                <SubmitBuildingSidebar 
                    clickedPosition={clickedPosition}  // Pass the clicked position to sidebar if needed
                />
                <div style={{ flex: 1 }}>
                    <MapComponent 
                        handleMapClick={handleMapClick}  // Pass handler for map clicks
                        clickedPosition={clickedPosition}  // Pass the clicked position to the map
                    />
                </div>
            </div>
        </div>
    );
};

export default SubmitBuildingView;
