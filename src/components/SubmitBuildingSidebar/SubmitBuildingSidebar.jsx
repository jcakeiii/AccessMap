import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { addDoc, collection } from 'firebase/firestore';

const SubmitBuildingSidebar = ({ clickedPosition }) => {
    const [buildingName, setBuildingName] = useState('');
    const [buildingDescription, setBuildingDescription] = useState('');
    const [location, setLocation] = useState(null);

    // Update location when the clicked position changes
    useEffect(() => {
        if (clickedPosition) {
            setLocation(clickedPosition);
        }
    }, [clickedPosition]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!buildingName || !location) {
            alert("Please enter a building name and select a location on the map.");
            return;
        }

        try {
            const buildingsRef = collection(firestore, 'Buildings');
            await addDoc(buildingsRef, {
                name: buildingName,
                description: buildingDescription,
                location: { 
                    lat: location.lat,
                    lng: location.lng 
                },
            });
            alert("Building added successfully!");
            setBuildingName('');
            setBuildingDescription('');
            setLocation(null);  // Clear position after submission
        } catch (error) {
            console.error("Error adding building: ", error);
            alert("Failed to add the building. Please try again.");
        }
    };

    return (
        <div className="sidebar bg-light p-4" style={{ width: '300px' }}>
            <h5>Add New Building</h5>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBuildingName" className="mb-3">
                    <Form.Label>Building Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter building name" 
                        value={buildingName} 
                        onChange={(e) => setBuildingName(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group controlId="formBuildingDescription" className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="Enter building description" 
                        value={buildingDescription} 
                        onChange={(e) => setBuildingDescription(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group controlId="formLocation" className="mb-3">
                    <Form.Label>Selected Location</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={location ? `Lat: ${location.lat}, Lng: ${location.lng}` : 'Click on the map to select a location'}
                        readOnly 
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={!location}>
                    Submit Building
                </Button>
            </Form>
        </div>
    );
};

export default SubmitBuildingSidebar;
