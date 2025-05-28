import { Container, Row, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useOrchestrator } from "../../orchestrationService/Orchestrator";
import { useDataStore } from "../../orchestrationService/DataStore";

import "../../../style/Taketest.css";

export default function TakeTest() {
  const location = useLocation();
  
  const { getData } = useDataStore();
  const { routeNext, routeBack } = useOrchestrator();

  const course = getData("knownDomain");
  const isFreasher = course === "Fresher";

  return (
    <Container className="takeTestContainer">
      <Container className="test-innerContainer">
        <Row>
          <h1 className="test-text ">
            Let's analyze your level in {isFreasher ? "understanding of programming" : course}
          </h1>
        </Row>
        <Row className="test-btns">
          <Button
            className="test-btn btn"
            onClick={() =>
              routeNext(location.pathname)
            }
          >
            Take Test
          </Button>
          <Button className="back-btn btn" onClick={() => routeBack(location.pathname)}>
            Back
          </Button>
        </Row>
      </Container>
    </Container>
  );
}
