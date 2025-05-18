import { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
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
          <Form.Control
            type="email"
            placeholder="Username / Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-danger">{error}</p>}
          <Button type="submit">Login</Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
