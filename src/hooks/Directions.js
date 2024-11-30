import { useState, useEffect } from 'react';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

const Directions = ({ origin, destination, travelMode }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState();
    const [directionsRenderer, setDirectionsRenderer] = useState();
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        const renderer = new routesLibrary.DirectionsRenderer({
            map,
            draggable: true,  // Enable draggable routes
        });
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(renderer);
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
        }).catch(error => {
            console.error("Error fetching directions:", error);
        });
    }, [directionsService, directionsRenderer, origin, destination, travelMode]);

    return null;
};

export default Directions;
