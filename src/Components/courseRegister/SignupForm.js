import { useState } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import { useOrchestrator } from "../orchestrationService/Orchestrator";
import { useDataStore } from "../orchestrationService/DataStore";

import "../../style/login.css";

function SignupForm() {
  const location = useLocation();

  const { routeNext, routeTo } = useOrchestrator();
  const { updateData } = useDataStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line 
  const [error, setError] = useState("");
  const [name_, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    updateData("name", name_.toUpperCase());
    routeNext(location.pathname);
    // setError("");
    // try {
    //   const response = await authService.login(email, password);
    //   if (response.success) {
    //     navigate("/");
    //   }
    // } catch (err) {
    //   setError(err.message || "Login failed. Please try again.");
    // }
  };

  return (
    <Container fluid className="login-container">
      <div className="login-header">
        <h1 className="colored">LUWA</h1>
        <Button className="reg-btn" onClick={() => routeTo("login")}>
          Login
        </Button>
      </div>

      <div className="login-form">
        <Form className="form-box" onSubmit={handleSubmit}>
          <Row className="form-fields">
            <Col className="form-field" xs={12} md={6}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={name_}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Col>

            <Col className="form-field" xs={12} md={6}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Col>
            
            <Col className="form-field" xs={12} md={6}>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Col>

            <Col className="form-field" xs={12} md={6}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Col>

            <Col className="form-field" xs={12} md={6}>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Col>
          </Row>
          {error && <p className="text-danger">{error}</p>}
          <Button type="submit">Next</Button>
        </Form>
      </div>
    </Container>
  );
}

export default SignupForm;
