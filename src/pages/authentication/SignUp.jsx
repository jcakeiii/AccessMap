import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../../config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState(null);

  // Google sign up/sign in 
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user is using a depauw.edu email
      if (!user.email.endsWith("@depauw.edu")) {
          setError("Please use your DePauw email address (@depauw.edu).");
          toast.error(err.message, {
            position: "bottom-center",
          });
          return; 
      }

      // Add user to Firestore if it's their first sign-in
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName: fname,
        lastName: lname, 
        photo: user.photoURL || "",
      });

      toast.success("Signed Up with Google successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error(err.message);
      setError(err.message);
      toast.error(err.message, {
        position: "top-center",
      });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email.endsWith("@depauw.edu")) {
      setError("Please use your DePauw email address (@depauw.edu).");
      setEmail("");
      setPassword("");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
        });
      }
      console.log("Signed Up Successfully!");
      toast.success("Signed Up Successfully!", {
        position: "top-center",
      });
      setError(null);
    } catch (error) {
      console.log(err.message);
      setError(err.message);
      toast.error(err.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="text-center mb-4">Join the AccessMap Community</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <p className="text-muted text-center">
              For security reasons, only DePauw community members can sign up
              for an account. <br /> Please ensure you are using your DePauw
              depauw.edu email address to sign up for an account.
            </p>
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
                <Button
                  variant="outline-primary"
                  type="button"
                  onClick={handleGoogleSignUp}>
                  Sign Up with Google
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <p>
                Already have an account? <a href="/sign-in">Login</a>
              </p>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
      <Footer />
    </>
  );
};

export default SignUp;
