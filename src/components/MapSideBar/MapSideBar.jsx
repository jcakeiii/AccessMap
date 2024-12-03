import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { useMarkers } from '../../hooks/useMarkers'; // Path to your useMarkers hook

export const MapSidebar = ({ isOpen, onClose, building }) => {
    const {
        markers,
        getMarkerIcon,
        handleMarkerClick,
        selectedMarker,
    } = useMarkers(building);

    const formatType = (type) => {
        if (!type) return "";
        return type
          .replace(/([a-z])([A-Z])/g, "$1 $2") 
          .replace(/^./, (str) => str.toUpperCase()); 
      };

    if (!isOpen) return null;

    return (
        <Card
            className="position-absolute top-0 start-0 h-100 rounded-0 shadow"
            style={{
                width: '400px',
                maxWidth: '90%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                zIndex: 100,
            }}
        >
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>{building?.name || 'Building Details'}</h2>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={onClose}>
                        ×
                    </Button>
                </div>
                {markers.length === 0 ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading markers...</p>
                    </div>
                ) : (
                    <ListGroup>
                        {markers.map((marker) => (
                            <ListGroup.Item
                            key={marker.id}
                            className={`d-flex align-items-center ${
                                selectedMarker?.id === marker.id ? 'bg-light' : ''
                            }`}
                            onClick={() => handleMarkerClick(marker)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem', 
                                cursor: 'pointer',
                            }}>
                            <img
                                src={getMarkerIcon(marker.type)}
                                alt={marker.type}
                                style={{
                                    flexShrink: 0,
                                    width: '30px',
                                    height: '30px',
                                }}/>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textAlign: 'left', 
                                }}>
                                <strong style={{ marginBottom: '5px' }}>{formatType(marker.type)}</strong>
                                <p
                                    className="mb-0"
                                    style={{
                                        fontSize: '14px',
                                        color: '#6c757d', // Optional: Adjust text color for description
                                    }}
                                >
                                    {marker.description}
                                </p>
                            </div>
                        </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
};

export default MapSidebar;
