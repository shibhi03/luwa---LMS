import { useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../style/CourseRegister.css";
import { useDataStore } from "../orchestrationService/DataStore";
import { useOrchestrator } from "../orchestrationService/Orchestrator";

export default function CourseRegister() {
  const location = useLocation();

  const { getData } = useDataStore();
  const { routeNext } = useOrchestrator();

  const name_ = getData("name");
  
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
              onClick={() => routeNext(location.pathname)}
            >
              Get Started
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
