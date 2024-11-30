import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Directions from '../../hooks/Directions';

const RoutingSidebar = ({ setOriginPlaceId, setDestinationPlaceId, setTravelMode }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  useEffect(() => {
    const originAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('origin-input'),
      { fields: ['place_id', 'name'] } // Request both place_id and name
    );
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('destination-input'),
      { fields: ['place_id', 'name'] }
    );

    originAutocomplete.addListener('place_changed', () => {
      const place = originAutocomplete.getPlace();
      if (place.place_id) {
        setOriginPlaceId(place.place_id);
        setOrigin(place.name || ''); // Set the input field with the selected place name
      }
    });

    destinationAutocomplete.addListener('place_changed', () => {
      const place = destinationAutocomplete.getPlace();
      if (place.place_id) {
        setDestinationPlaceId(place.place_id);
        setDestination(place.name || ''); // Set the input field with the selected place name
      }
    });

    // Cleanup on unmount
    return () => {
      google.maps.event.clearInstanceListeners(originAutocomplete);
      google.maps.event.clearInstanceListeners(destinationAutocomplete);
    };
  }, [setOriginPlaceId, setDestinationPlaceId]);

  const handleInputChange = (type) => (e) => {
    const value = e.target.value;
    type === 'origin' ? setOrigin(value) : setDestination(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin && destination) {
      setOriginPlaceId(origin); // set the actual place ID 
      setDestinationPlaceId(destination); 
      console.log("Searching route from", origin, "to", destination);
    }
  };

  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    top: '56px',
    height: 'calc(100vh - 56px)',
    width: '25%',
    backgroundColor: 'white',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    zIndex: 1000,
    padding: '1rem',
    overflowY: 'auto'
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#333'
  };

  return (
    <div style={sidebarStyle}>
      <h4 className="text-center mb-4">
        <i className="bi bi-geo-alt me-2" />
        Find Route
      </h4>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label style={labelStyle}>From</Form.Label>
          <Form.Control
            id="origin-input"
            type="text"
            placeholder="Search origin building..."
            value={origin}
            onChange={handleInputChange('origin')}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label style={labelStyle}>To</Form.Label>
          <Form.Control
            id="destination-input"
            type="text"
            placeholder="Search destination building..."
            value={destination}
            onChange={handleInputChange('destination')}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mt-2"
          disabled={!origin || !destination}
          onClick={handleSubmit}
        >
          Find Route
        </Button>
      </Form>
    </div>
  );
};

export default RoutingSidebar;
