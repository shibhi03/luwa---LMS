import { Container, Row, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Taketest.css";

export default function TakeTest() {
  const navigate = useNavigate();
  const location = useLocation();

  const course = location.state.selectedDomain;

  return (
    <Container className="takeTestContainer">
      {course === "Freasher" && navigate("/your-journey")}
      <Container className="test-innerContainer">
        <Row>
          <h1 className="test-text ">Let's analyze your level in {course}</h1>
        </Row>
        <Row className="test-btns">
          <Button className="test-btn btn" onClick={() => navigate('/takeTest/questions', {state: {course}})}>Take Test</Button>
          <Button className="back-btn btn" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Row>
      </Container>
    </Container>
  );
}
