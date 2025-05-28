import { useState } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./style/login.css";
import authService from "./services/authService";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <Container fluid className="login-container">
      <div className="login-header">
        <h1 className="colored">LUWA</h1>
        <Button className="reg-btn" onClick={() => navigate("/signup")}>
          Register
        </Button>
      </div>

      <div className="login-form">
        <Form className="form-box" onSubmit={handleSubmit}>
          <Row
            className="form-fields"
            style={{ display: "block", width: "50%" }}
          >
            <Col className="form-field" xs={12} md={6}>
              <Form.Label>Email / Username</Form.Label>
              <Form.Control
                type="email"
                placeholder="Username / Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Col>

            <Col
              className="form-field"
              xs={12}
              md={6}
              style={{ marginTop: "20px" }}
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Col>
          </Row>
          {error && <p className="text-danger">{error}</p>}
          <Button type="submit">Login</Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
