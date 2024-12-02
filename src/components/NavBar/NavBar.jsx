import { Navbar, Nav, Button, Container, Form, FormControl, Toast } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Update state if user exists
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully!", {
        position: "top-center",
      });
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error("An error has occurred while signing out. Please try again", {
        position: "top-center",
      });
    }
  };

  return (
    <Navbar expand="lg">
      <Container className="w-60">
        <Navbar.Brand href="/">AccessMap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-3">
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="/my-location">My Location</Nav.Link>
            <Nav.Link
              href="https://www.depauw.edu/academics/academic-resources/student-accessibility/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resources
            </Nav.Link>
          </Nav>
          <Form className="d-flex mx-auto">
            <FormControl
              type="search"
              placeholder="Enter a building name..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-primary">Search</Button>
          </Form>
          <Nav className="ms-auto gap-3">
            <Link to="/contribute">
              <Button variant="warning">Contribute</Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-account">
                  <Button variant="outline-primary">My Account</Button>
                </Link>
                <Button variant="info" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="outline-primary">Log in</Button>
                </Link>
                <Link to="/sign-up">
                  <Button variant="primary">Sign up</Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ToastContainer/>
    </Navbar>
  );
};

export default NavBar;
