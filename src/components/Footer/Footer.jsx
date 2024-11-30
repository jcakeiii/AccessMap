import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-5 footer-full-width">
      <Container fluid>
        <Container>
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <h5 className="text-primary mb-3">AccessMap</h5>
              <p className="small">Making DePauw University accessible for everyone.</p>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <h5 className="text-primary mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light text-decoration-none">Home</a></li>
                <li><a href="#" className="text-light text-decoration-none">About</a></li>
                <li><a href="#" className="text-light text-decoration-none">Contribute</a></li>
                <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5 className="text-primary mb-3">Connect With Us</h5>
              <div className="d-flex">
                <a href="#" className="text-light me-3" aria-label="Facebook"><Facebook size={24} /></a>
                <a href="#" className="text-light me-3" aria-label="Twitter"><Twitter size={24} /></a>
                <a href="#" className="text-light me-3" aria-label="Instagram"><Instagram size={24} /></a>
                <a href="#" className="text-light" aria-label="Email"><Mail size={24} /></a>
              </div>
            </Col>
          </Row>
          <hr className="my-4 bg-light" />
          <Row>
            <Col className="text-center">
              <p className="small mb-0">&copy; {currentYear} AccessMap - DePauw University. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </Container>
    </footer>
  );
};

export default Footer;