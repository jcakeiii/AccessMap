import { Container, Button, Form, FormControl, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import About from './About.jsx'
import SearchBar from '../SearchBar/SearchBar.jsx'
import './Intro.css'

const Intro = () => {
  return (
    <>
    <Container fluid className="mt-2 pt-5 intro">
      <Row>
        <Col lg={6} md={8} sm={10} className="mx-auto mx-lg-0" style={{ marginTop: '5rem' }}>
          <h1 className="mb-4">AccessMap</h1>
          <h4 className="mb-4">Find the accessibility options you need</h4>
          
          <SearchBar/>

          <p className="my-3">OR</p>
          <Link to="my-location"><Button variant="primary">View my current location</Button></Link>
          <p className="my-3">OR</p>
          <Link to="search-routes"><Button variant="warning">Search for routes</Button></Link>
        </Col>
        <Col lg={6} md={8} sm={10} className="mx-auto mx-lg-0">
            <Image src="./src/assets/intro-pic.png" fluid alt="DePauw University's Map" 
            style={{ width: '78%', borderRadius: '10px' }}/>
            <h3 className="pt-4"> Welcome to DePauw University!</h3>
        </Col>
      </Row>
    </Container>
    <section id="about">
      <About />
    </section>
    </>
  );
};

export default Intro;