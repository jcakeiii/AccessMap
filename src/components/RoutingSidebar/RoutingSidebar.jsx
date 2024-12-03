import { useEffect, useState } from 'react';
import { Form, Button, Tabs, Tab, ListGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const RoutingSidebar = ({ 
    setOriginPlaceId, 
    setDestinationPlaceId, 
    setTravelMode,
    routes = [], // Alternative routes
    savedRoutes = [], // Saved routes
}) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [activeTab, setActiveTab] = useState('search');
    const [currentRoutes, setCurrentRoutes] = useState(routes);

    useEffect(() => {
      setCurrentRoutes(routes); // Update routes when prop changes
  }, [routes]);

    useEffect(() => {
        const originAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('origin-input'),
            { fields: ['place_id', 'name'] }
        );
        const destinationAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('destination-input'),
            { fields: ['place_id', 'name'] }
        );

        originAutocomplete.addListener('place_changed', () => {
            const place = originAutocomplete.getPlace();
            if (place.place_id) {
                setOriginPlaceId(place.place_id);
                setOrigin(place.name || '');
            }
        });

        destinationAutocomplete.addListener('place_changed', () => {
            const place = destinationAutocomplete.getPlace();
            if (place.place_id) {
                setDestinationPlaceId(place.place_id);
                setDestination(place.name || '');
            }
        });
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
            setOriginPlaceId(origin);
            setDestinationPlaceId(destination);
            console.log("Searching route from", origin, "to", destination);
            setActiveTab('alternatives');
        }
    };

    const sidebarStyle = {
        position: 'fixed',
        left: 0,
        top: '56px',
        height: 'calc(100vh - 56px)',
        width: '32%',
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

    const renderSearchTab = () => (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
                <Form.Label style={labelStyle}>From</Form.Label>
                <Form.Control
                    id="origin-input"
                    type="text"
                    placeholder="Search origin building..."
                    value={origin}
                    onChange={handleInputChange('origin')} />
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label style={labelStyle}>To</Form.Label>
                <Form.Control
                    id="destination-input"
                    type="text"
                    placeholder="Search destination building..."
                    value={destination}
                    onChange={handleInputChange('destination')} />
            </Form.Group>

            <Button
                variant="primary"
                type="submit"
                className="w-100 mt-2"
                disabled={!origin || !destination}
                onClick={handleSubmit}>
                Find Route
            </Button>
            <p className="text-muted mt-2">Routes searching searches for Walking routes by default.</p>
        </Form>
    );

    const renderAlternativesTab = () => (
      <div>
          <h5 className="mb-3">Alternative Routes</h5>
          {currentRoutes.length === 0 ? (
              <p>No routes found</p>
          ) : (
              <ListGroup>
                  {currentRoutes.map((route, index) => (
                      <ListGroup.Item key={index}>
                          <div>
                              <strong>Route {index + 1}</strong>
                              <p>Distance: {route.distance}</p>
                              <p>Duration: {route.duration}</p>
                              <ul>
                                  {route.steps.map((step, idx) => (
                                      <li key={idx} dangerouslySetInnerHTML={{ __html: step }} />
                                  ))}
                              </ul>
                          </div>
                      </ListGroup.Item>
                  ))}
              </ListGroup>
          )}
      </div>
  );

    const renderSavedRoutesTab = () => (
        <div>
            <h5 className="mb-3">Saved Routes</h5>
            {savedRoutes.length === 0 ? (
                <p>No saved routes yet</p>
            ) : (
                <ListGroup>
                    {savedRoutes.map((route, index) => (
                        <ListGroup.Item 
                            key={index} 
                            className="d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{route.origin} → {route.destination}</strong>
                                <br />
                                Distance: {route.routes[0].distance}
                                <br />
                                Duration: {route.routes[0].duration}
                            </div>

                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );

    return (
        <div style={sidebarStyle}>
            <h4 className="text-center mb-4">
                <i className="bi bi-geo-alt me-2" />
                Find Route
            </h4>

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
            >
                <Tab eventKey="search" title="Search">
                    {renderSearchTab()}
                </Tab>
                <Tab 
                    eventKey="alternatives" 
                    title="Alternatives" 
                    disabled={routes.length === 0}>
                    {renderAlternativesTab()}
                </Tab>
                <Tab eventKey="saved" title="Saved">
                    {renderSavedRoutesTab()}
                </Tab>
            </Tabs>

            <ToastContainer />
        </div>
    );
};

export default RoutingSidebar;