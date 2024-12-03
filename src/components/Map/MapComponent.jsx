// Map Component, handles everything: Show current location, submit feature type, display pop-up windows, 
// display searching for routes 
import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import InfoPopup from "../InfoPopup/InfoPopup";
import { useMarkers } from '../../hooks/useMarkers';
import { toast, ToastContainer } from "react-toastify"; 

// Directions function for searching routes, merged with map component for easy communication 
const Directions = ({ origin, destination, travelMode }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState();
    const [directionsRenderer, setDirectionsRenderer] = useState();
    const [routes, setRoutes] = useState([]); 
    const [routeIndex, setRouteIndex] = useState(0); 

    useEffect(() => {
        if (!routesLibrary || !map) return;
        const renderer = new routesLibrary.DirectionsRenderer({
            map,
            draggable: true,
        });
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(renderer);

        renderer.addListener("directions_changed", () => {
            const updatedDirections = renderer.getDirections();
            if (updatedDirections && onRouteChange) {
                onRouteChange({
                    routes: updatedDirections.routes.map(route => ({
                        distance: route.legs[0].distance.text,
                        duration: route.legs[0].duration.text,
                        steps: route.legs[0].steps.map(step => step.instructions)
                    }))
                });
            }
        });
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer || !origin || !destination) return;

        directionsService.route({
            origin,
            destination,
            travelMode: travelMode || google.maps.TravelMode.WALKING,
            provideRouteAlternatives: true,
        }).then(response => {
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);
            
            // Callback to pass route information to parent
            if (onRoutesFound) {
                onRoutesFound({
                    origin,
                    destination,
                    travelMode,
                    routes: response.routes.map(route => ({
                        distance: route.legs[0].distance.text,
                        duration: route.legs[0].duration.text,
                        steps: route.legs[0].steps.map(step => step.instructions)
                    }))
                });
            }
        }).catch(error => {
            console.error("Error fetching directions:", error);
        });
    }, [directionsService, directionsRenderer, origin, destination, travelMode]);

    return null; 
};

// Map Component 
export const MapComponent = ({ 
    building, 
    position, 
    handleMapClick, 
    clickedPosition, 
    featureType, 
    userLocation, 
    originPlaceId, 
    destinationPlaceId, 
    travelMode, 
    onRouteSave,
    updateSidebarRoutes 
}) => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentRoute, setCurrentRoute] = useState(null);
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
                    onClick={handleMapClickEvent} >
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
                            onClick={() => handleMarkerSelect(marker)} >
                            <img 
                                src={getMarkerIcon(marker.type)} 
                                style={{ width: "30px", height: "30px" }} 
                                alt={marker.type} />
                        </AdvancedMarker>
                    ))}

                    {/* Info popup */}
                    {selectedMarker && (
                        <InfoPopup 
                            position={selectedMarker.position}
                            feature={selectedMarker}
                            onClose={handleCloseInfoPopup}
                            isOpen={isPopupOpen} />
                    )}
                </Map>
            </div>
        </APIProvider>
    );
};

export default MapComponent;