import { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';


export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/";
            toast.success("Logged in successfully!", {
                position: "top-center",
            });
        } catch (error) {
            console.log(error.message);
            setError(error.message);
            toast.error("Failed to log in, the following has occurred:", error.message, {
                position: "bottom-center",
            });
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            window.location.href = "/";
            toast.success("Logged in successfully!", {
                position: "top-center",
            });
        } catch (error) {
            console.log(error.message);
            setError(error.message);
            toast.error(error.message, {
                position: "bottom-center",
            });
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mb-4">Sign In To Your AccessMap Account</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSignIn}>
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
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Sign In
                            </Button>
                            <Button variant="outline-primary" onClick={signInWithGoogle}>
                                Sign in with Google
                            </Button>
                        </div>
                    </Form>
                    <div className="text-center mt-3">
                        <p>Don't have an account? <Link to="/sign-up">Sign up</Link></p>
                    </div>
                </Col>
            </Row>
            <ToastContainer/>
        </Container>
    );
};

export default SignIn;