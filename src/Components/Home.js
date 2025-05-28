import { Row, Container, Col, Button } from "react-bootstrap";
import { useOrchestrator } from "./orchestrationService/Orchestrator";
import "../style/Home.css";

export default function Home() {
  const { routeTo } = useOrchestrator();

  return (
    <Container className="home">
      <Container className="homeContainer">
        <Row className="title">
          <h1 className="name">LUWA</h1>
          <h2 className="abbrivation">
            <span className="colored">L</span>earn in yo
            <span className="colored">U</span>r{" "}
            <span className="colored">WA</span>y
          </h2>
        </Row>
        <Row className="get-started">
          <Col>
            <button className="btn login" onClick={() => routeTo("login")}>
              Login
            </button>
          </Col>
          <p className="or"></p>
          <Col>
            <Button className="btn signup" onClick={() => routeTo("signup")}>
              Register
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
