import { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Button, Tab, Tabs, Form, Spinner } from "react-bootstrap";
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer'; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, getFirestore, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState([]);
  const [loadingContributions, setLoadingContributions] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Listen for auth state changes, then fetch user data
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
          await fetchContributions(userDoc.data().contributions || []);
        } else {
          console.warn("No user document found");
          toast.error("Error loading your profile. Please try again", {
            position: "top-center",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const fetchContributions = async (contributionIds) => {
    setLoadingContributions(true);
    try {
      if (contributionIds.length > 0) {
        const accessibilityFeaturesRef = collection(db, "accessibilityFeatures");
        const featureDocs = await Promise.all(
          contributionIds.map(async (id) => {
            const featureDoc = await getDoc(doc(accessibilityFeaturesRef, id));
            if (featureDoc.exists()) {
              const featureData = featureDoc.data();
  
              // Fetch the building document
              if (featureData.building) {
                const buildingDoc = await getDoc(featureData.building);
                if (buildingDoc.exists()) {
                  featureData.building = {
                    id: buildingDoc.id,
                    ...buildingDoc.data(),
                  };
                } else {
                  featureData.building = null;
                }
              }
  
              return { id, ...featureData };
            }
            return null;
          })
        );
  
        setContributions(featureDocs.filter((doc) => doc !== null));
      }
    } catch (error) {
      toast.error("Error fetching contributions.", { position: "top-center" });
    } finally {
      setLoadingContributions(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // Add your profile update logic here
  };

  const handleDeleteContribution = async (contributionId) => {
    try {
      // Remove the contribution from Firestore
      await deleteDoc(doc(db, "accessibilityFeatures", contributionId));

      // Update user's contribution array in Firestore
      const userDocRef = doc(db, "Users", user.uid);
      await updateDoc(userDocRef, {
        contributions: arrayRemove(contributionId),
      });

      setContributions((prev) => prev.filter((item) => item.id !== contributionId));
      toast.success("Contribution deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete contribution.");
      console.log(error); 
    }
  };

  // Reformat accessibility type 
  const formatType = (type) => {
    if (!type) return "";
    return type
      .replace(/([a-z])([A-Z])/g, "$1 $2") 
      .replace(/^./, (str) => str.toUpperCase()); 
  };

  // Ensure the user is logged in
  useEffect(() => {
    if (!user && !loading) {
      toast.error("Please log in to view your profile.", {
        position: "top-center",
      });
    }
  }, [user, loading]);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <h4>{userData.name || user.displayName || "User"}</h4>
                <p>{user.email}</p>
                <Tabs defaultActiveKey="contributions" className="mt-4">
                  {/* My Contributions */}
                  <Tab eventKey="contributions" title="My Contributions">
                    <ListGroup className="mt-3">
                      {loadingContributions ? (
                        <Spinner animation="border" />
                      ) : contributions.length > 0 ? (
                        contributions.map((contribution) => (
                            <ListGroup.Item key={contribution.id}>
                            <p><strong>{formatType(contribution.type)}</strong> <br />
                            <strong>Description: </strong>{contribution.description} <br />
                            <strong>Building:</strong> {contribution.building?.name || "Unknown"}
                            </p>
                            <Button
                              variant="link"
                              className="text-danger float-end"
                              onClick={() => handleDeleteContribution(contribution.id)}>
                              Delete
                            </Button>
                          </ListGroup.Item>
                        ))
                      ) : (
                        <p className="mt-2">No contributions yet.</p>
                      )}
                    </ListGroup>
                  </Tab>

                  {/* Saved Routes */}
                  <Tab eventKey="savedRoutes" title="Saved Routes">
                    <ListGroup className="mt-3">
                      {userData.savedRoutes?.length > 0 ? (
                        userData.savedRoutes.map((route, index) => (
                          <ListGroup.Item key={index}>
                            {route}
                            <Button variant="link" className="text-danger float-end">
                              Delete
                            </Button>
                          </ListGroup.Item>
                        ))
                      ) : (
                        <p className="mt-2">No saved routes yet.</p>
                      )}
                    </ListGroup>
                  </Tab>

                  {/* Account Settings */}
                  <Tab eventKey="settings" title="Account Settings">
                    <Form className="mt-3" onSubmit={handleProfileUpdate}>
                      <Form.Group controlId="formName" className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your name"
                          defaultValue={userData.name || ""}
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Update Profile
                      </Button>
                    </Form>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <ToastContainer/>
      </Container>
      <Footer/>
    </>
  );
};

export default UserProfile;
