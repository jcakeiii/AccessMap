import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../../config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo:""
        });
      }
      console.log("Signed Up Successfully!");
      toast.success("Signed Up Successfully!", {
        position: "top-center",
      });
      setError("null");
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      toast.error(err.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <Container className="mt-5">
        <Row className="justify-content-center">
            <Col md={6}>
                <h2 className="text-center mb-4">Join the AccessMap Community</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSignUp}>
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicLastName">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                        </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit">
                            Sign Up
                        </Button>
                    </div>
                    </Form>
                    <div className="text-center mt-3">
                        <p>Already have an account? <a href="/sign-in">Login</a></p>
                    </div>
                </Col>
            </Row>
            <ToastContainer />
        </Container>
  );
}
export default SignUp;