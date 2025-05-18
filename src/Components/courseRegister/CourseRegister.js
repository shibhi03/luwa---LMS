import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../style/CourseRegister.css";

export default function CourseRegister() {
  const navigate = useNavigate();
  const location = useLocation();

  const name_ = location.state?.name_;
  
  return(
    <Container className="signup-container">
      <Container className="signup-innerContainer">
        <Row className="signup-row">
          <Col className="signup-col">
            <h1 className="signup-title">Hello, {name_}...</h1>
          </Col>
          <Col className="signup-col">
            <h2 className="signup-text">
              Get strated to personalize your learning journey!
            </h2>
          </Col>
          <Col className="signup-col">
            <Button
              className="signup-btn"
              onClick={() => navigate("/signup/CourseRegister/courses")}
            >
              Get Started
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
