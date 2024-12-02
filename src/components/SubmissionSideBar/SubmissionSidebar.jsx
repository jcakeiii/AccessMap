// Submission sidebar to submit feature type. SubmitView's child component 
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Upload } from 'lucide-react';
import { db } from "../../config/firebase";
import { collection, doc, addDoc, GeoPoint } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid'; // Generate id for image

const MAX_FILE_SIZE = 2 * 1024 * 1024; // Set max image size to 2 MB 
const MAX_WORDS = 50; // Set max word count for description 
const SubmissionSidebar = ({ navbarHeight = '56px', building, setClickedPosition, setFeatureType, clickedPosition }) => {
    const [formData, setFormData] = useState({
        featureType: '',
        description: '',
        imageUrl: null
  });
  const [imageError, setImageError] = useState(''); // Error for image size 
  const [wordCount, setWordCount] = useState(0); // Word count for description
  const [descriptionError, setDescriptionError] = useState(''); // Error for word limit
  const buildingRef = doc(db, 'Buildings', building.id);

    const handleFeatureTypeChange = (e) => {
        const newfeatureType = e.target.value;
        setFormData(prev => ({ ...prev, featureType: newfeatureType }));
        setFeatureType(newfeatureType);  // Pass featureType back to parent
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, image: file }));
        if (file && file.size > MAX_FILE_SIZE) {
          setImageError('Image size exceeds 2 MB. Please upload a smaller image ');
          setFormData((prev) => ({ ...prev, image: null }));
        } else {
          setImageError('');
          setFormData((prev) => ({ ...prev, image: file }));
        }
  };
    const handleDescriptionChange = (e) => {
      const input = e.target.value;
      const words = input.trim().split(/\s+/).filter((word) => word); // Split by spaces and filter empty strings
      const wordCount = words.length;

      if (wordCount > MAX_WORDS) {
        setDescriptionError(`Description cannot exceed ${MAX_WORDS} words.`);
      } else {
        setDescriptionError('');
      }

      setWordCount(wordCount);
      setFormData((prev) => ({ ...prev, description: input }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        // Validate latitude and longitude
        if (!clickedPosition) {
            toast.error("Please click on a location on the map to set the location of your accessibility feature", {
                position: "top-center",
            });
            return;
        }
        // Validate description word count 
        if (descriptionError) {
          toast.error("Please make sure description does not exceed 50 words.", {
            position: "top-center",
        });
          return;
        }
        
        // Validate feature type
        if (formData.featureType === '') {
            toast.error("Please select an accessibility feature type", {
                position: "top-center",
            });
            return;
        }
        // Validate description
        if (formData.description === '') {
            toast.error("Please add a description for your accessibility feature", 
            { position: "top-center" 
            });
            return;
        }
        let imageUrls = [];
        if (imageError) {
          console.log(imageError); 
          return; // Prevent form submission if there's an image error
        }
        if (formData.image) {
            // Upload the image to Firebase Storage
            const imageRef = ref(storage, `featureImages/${uuidv4()}`); // Use uuid to generate a unique image name
            const snapshot = await uploadBytes(imageRef, formData.image);
            const url = await getDownloadURL(snapshot.ref);  // Get the uploaded image's URL
            imageUrls.push(url);
        }
        try {
            // Create the feature document in Firestore
            const featureData = {
                building: buildingRef, // Set building to refer the corresponding building document
                locationDetails: new GeoPoint(
                    parseFloat(clickedPosition.lat), 
                    parseFloat(clickedPosition.lng)
                ),
                type: formData.featureType,
                description: formData.description,
                createdAt: new Date(),  // Add timestamp
                imageUrl: imageUrls
            };

            // Add to Firestore
            const accessibilityFeaturesRef = collection(db, 'accessibilityFeatures');
            const docRef = await addDoc(accessibilityFeaturesRef, featureData);
            
            console.log("Feature added with ID: ", docRef.id);
            console.log("Submitted Successfully!");
            toast.success("Submitted Successfully!", {
            position: "top-center",
            });

            // Reset form fields after submitting
            setFormData({ featureType: '', description: '', image: null, createdAt: null})
        } catch (error) {
            console.error('Error adding document: ', error);
            toast.error("Error submitting a new feature. Please try again.", 
            { position: "top-center" 
            });
        }
    };

    const sidebarStyle = {
        position: 'fixed',
        left: 0,
        top: navbarHeight, 
        height: `calc(100vh - ${navbarHeight})`,
        width: '35%',
        backgroundColor: 'white',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000,
        overflowY: 'auto'
    };

    const imageUploadStyle = {
        border: '2px dashed #dee2e6',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer'
    };

  return (
    <div style={sidebarStyle}>
      <div className="p-4">
        <h4 className="text-center mb-4">
          Thank you for your contribution to AccessMap!
        </h4>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Accessibility Feature Type</Form.Label>
            <Form.Select
              value={formData.featureType}
              onChange={handleFeatureTypeChange}
              required
            >
              <option value="">Select feature type</option>
              <option value="elevator">Elevator</option>
              <option value="ramp">Ramp</option>
              <option value="accessibleDoor">Accessible door</option>
              <option value="mainEntrance">Main Entrance</option>
              <option value="singleRestroom">Single-user Restroom</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Enter a Location Description</Form.Label>
                <Form.Text className="text-muted">
                    <br/>Enter a brief description of where this feature is in the building.
                </Form.Text>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter location description"
              value={formData.description}
              onChange={handleDescriptionChange}
              required />
            <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
              Word count: {wordCount}/{MAX_WORDS}
            </p>
            {descriptionError && (
              <p className="text-danger" style={{ fontSize: '0.9rem' }}>
                {descriptionError}
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload an Image (Optional)</Form.Label>
            <div style={imageUploadStyle}>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="imageUpload"
                className="d-none"
              />
              <label htmlFor="imageUpload" className="mb-0 w-100">
                <Upload className="mb-2" size={24} />
                <div className="text-muted">
                  {formData.image ? formData.image.name : 'Click to upload image'}
                </div>
              </label>
            </div>
            {imageError && (
              <p className="text-danger mt-2" style={{ fontSize: '0.9rem' }}>
                {imageError}
              </p>
            )}
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mt-3"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Form>
        <ToastContainer/>
      </div>
    </div>
  );
};

export default SubmissionSidebar;