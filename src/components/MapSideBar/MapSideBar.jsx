import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export const MapSideBar = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <Card 
            className="position-absolute top-0 start-0 h-100 rounded-0 shadow"
            style={{
                width: '400px',
                maxWidth: '90%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                zIndex: 100
            }}
        >
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>{title}</h2>
                    <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={onClose}
                    >
                        ×
                    </Button>
                </div>
                {children}
            </Card.Body>
        </Card>
    );
};

export default MapSideBar;