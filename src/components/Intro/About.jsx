import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { UsersRound, Accessibility, DoorOpen, Search, MapPin, Star } from 'lucide-react';

const About = () => {
  return (
    <Container fluid className="about-section py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="about-content text-center">
            <h2 className="display-3 fw-bold mb-4 text-primary">Discover AccessMap</h2>
            <p className="lead mb-5">
              Your friendly guide to navigating DePauw University's 695-acre campus with ease!
            </p>
          </div>
          <Row className="feature-cards">
            {[
              { icon: UsersRound, title: "Crowdsourced Data", color: "var(--bs-primary)" },
              { icon: Accessibility, title: "Accessibility Features", color: "var(--bs-success)" },
              { icon: DoorOpen, title: "Easy Navigation", color: "var(--bs-warning)" },
            ].map((feature, index) => (
              <Col key={index} md={4} className="mb-4">
                <div className="feature-card p-4 rounded-lg shadow-sm">
                  <feature.icon size={48} color={feature.color} className="mb-3" />
                  <h3 className="h5 mb-2">{feature.title}</h3>
                </div>
              </Col>
            ))}
          </Row>
          <div className="about-description mt-5 p-4 bg-light rounded-lg shadow-sm">
            <p className="mb-0">
              AccessMap is your go-to resource for discovering ramps, elevators, and automatic doors across DePauw University. 
              Our user-friendly interface provides detailed locations, descriptions, and even user reviews to ensure everyone can navigate campus with confidence and ease.
            </p>
          </div>
          
          {/*How to Use AccessMap section - by Claude*/}
          <div className="how-to-use mt-5">
            <h3 className="display-4 fw-bold mb-4 text-center">How to Use AccessMap</h3>
            <Row className="justify-content-center">
              {[
                { icon: Search, title: "Search", description: "Use the search bar to find specific buildings or features." },
                { icon: MapPin, title: "Explore", description: "View your current location and nearby accessibility features." },
                { icon: Star, title: "Contribute", description: "Submit new features, reviews, and ratings to help others." },
              ].map((step, index) => (
                <Col key={index} md={4} className="mb-4">
                  <div className="how-to-use-card p-4 rounded-lg shadow-sm text-center">
                    <step.icon size={48} color="var(--bs-info)" className="mb-3" />
                    <h4 className="h5 mb-2">{step.title}</h4>
                    <p className="small">{step.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="contribution-note mt-4 p-4 bg-light rounded-lg shadow-sm">
              <p className="mb-0">
                AccessMap thrives on community input. Feel free to contribute by clicking "Contribute" to submit a new accessibility feature, or leave a review and rating for existing features. Your contributions make campus navigation easier for everyone!
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;