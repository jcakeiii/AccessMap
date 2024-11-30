import { Navbar, Nav, Button, Container, Form, FormControl } from 'react-bootstrap';
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar expand="lg">
      <Container className="w-60">
        <Navbar.Brand href="/">AccessMap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-3">
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="/my-location">My Location</Nav.Link>
            <Nav.Link href="https://www.depauw.edu/academics/academic-resources/student-accessibility/" target="_blank" rel="noopener noreferrer">Resources</Nav.Link>
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
            <Link to="/contribute"><Button variant="warning">Contribute</Button></Link>
            <Link to="/sign-in"><Button variant="outline-primary">Log in</Button></Link>
            <Link to="/sign-up"><Button variant="primary">Sign up</Button></Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;