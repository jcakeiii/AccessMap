// useMarkers hook fetches markers data and populate the map when a building's map renders + handle icon logic 
// Working on fetching nearby markers
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, doc, getDocs, query, where } from "firebase/firestore";

export const useMarkers = (building) => {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [nearbyMarkers, setNearbyMarkers] = useState([]);
    
    // Define custom marker icons for each feature type
    const markerIcon = {
        ramp: '../src/assets/ramp-1.png',
        elevator: '../src/assets/elevator-1.png', 
        accessibleDoor: '../src/assets/accessible-door .png', 
        entrance: '../src/assets/main-entrance.png', 
        singleRestroom: '../src/assets/single-user-restroom.png'
    };

    const getMarkerIcon = (type) => {
        return markerIcon[type];
    };

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const fetchBuildingMarkers = async () => {
        if (!building?.id) return;
            
        try {
            const buildingRef = doc(db, 'Buildings', building.id);
            const markersRef = collection(db, 'accessibilityFeatures');
            const q = query(markersRef, where('building', '==', buildingRef));
            const querySnapshot = await getDocs(q);
                
            const markersData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    position: {
                        lat: data.locationDetails.latitude,
                        lng: data.locationDetails.longitude
                    },
                    description: data.description,
                    type: data.type,
                    imageUrl: data.imageUrl
                };
            });
            setMarkers(markersData);
            console.log("Displaying markers:", markersData);
        } catch (error) {
            console.error("Error fetching markers:", error);
        }
    };
    // Working on fetching nearby markers
    // Query to look for coordinates within a certain range 
    const fetchNearbyMarkers = async (bounds) => {
        const { minLng, maxLng, minLat, maxLat } = bounds;
        const featuresRef = collection(db, "accessibilityFeatures");
        const nearbyQuery = query(featuresRef,
            where('_lng', '>=', minLng),
            where('_lng', '<=', maxLng),
            where('_lat', '>=', minLat),
            where('_lat', '<=', maxLat)
        );
        const querySnapshot = await getDocs(nearbyQuery);
        
        const nearbyMarkersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setNearbyMarkers(nearbyMarkersList);
    };

    useEffect(() => {
        if (building) {
            fetchBuildingMarkers();
        }
    }, [building]);


    return {
        markers,
        selectedMarker,
        handleMarkerClick,
        getMarkerIcon,
        markerIcon,
        nearbyMarkers,
        fetchNearbyMarkers
    };
};

export default useMarkers;