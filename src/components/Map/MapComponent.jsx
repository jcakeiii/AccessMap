import { useState } from "react";
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import InfoPopup from "../InfoPopup/InfoPopup";
import { useMarkers } from '../../hooks/useMarkers';
import Directions from '../../hooks/Directions';

export const MapComponent = ({ 
    building, 
    position, 
    handleMapClick, 
    clickedPosition, 
    featureType, 
    userLocation, 
    originPlaceId, 
    destinationPlaceId, 
    travelMode 
}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { 
        markers, 
        selectedMarker, 
        handleMarkerClick, 
        getMarkerIcon, 
        markerIcon 
    } = useMarkers(building);

    // Validate coordinates
    if (!position || !position.lat || !position.lng) {
        console.error("Invalid position data:", position);
        return <div>Error: Invalid location data</div>;
    }

    // Handle map click when uploading a new feature
    const handleMapClickEvent = (e) => {
        const newPosition = {
            lat: e.detail.latLng.lat,
            lng: e.detail.latLng.lng
        };

        if (handleMapClick) {
            handleMapClick(newPosition);
        }
    };

    // Handle marker select to display pop-up window 
    const handleMarkerSelect = (marker) => {
        handleMarkerClick(marker);
        setIsPopupOpen(true);
    };

    const handleCloseInfoPopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
            <div style={{ height: "90vh", width: "100%" }}>
                <Map 
                    defaultZoom={19.5} 
                    defaultCenter={position} 
                    zoomControl={true} 
                    scaleControl={true} 
                    mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
                    onClick={handleMapClickEvent}
                >
                    {/* Directions component with dynamic props */}
                    <Directions 
                        origin={originPlaceId} 
                        destination={destinationPlaceId} 
                        travelMode={travelMode} 
                    />

                    {/* User location marker */}
                    {userLocation && (
                        <AdvancedMarker position={userLocation} />
                    )}

                    {/* Clicked position marker for new feature */}
                    {clickedPosition && (
                        <AdvancedMarker position={clickedPosition}>
                            <img 
                                src={markerIcon[featureType]} 
                                style={{ width: "30px", height: "30px" }}
                                alt={featureType}
                            /> 
                        </AdvancedMarker>
                    )}

                    {/* Existing feature markers */}
                    {markers.map(marker => (
                        <AdvancedMarker
                            key={marker.id}
                            position={marker.position}
                            onClick={() => handleMarkerSelect(marker)}
                        >
                            <img 
                                src={getMarkerIcon(marker.type)} 
                                style={{ width: "30px", height: "30px" }} 
                                alt={marker.type}
                            />
                        </AdvancedMarker>
                    ))}

                    {/* Info popup */}
                    {selectedMarker && (
                        <InfoPopup 
                            position={selectedMarker.position}
                            feature={selectedMarker}
                            onClose={handleCloseInfoPopup}
                            isOpen={isPopupOpen}
                        />
                    )}
                </Map>
            </div>
        </APIProvider>
    );
};

export default MapComponent;
