import { Row, Container, Col, Button } from "react-bootstrap";
import "./style/Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

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
            <button className="btn login" onClick={() => navigate("/login")}>
              Login
            </button>
          </Col>
          <p className="or"></p>
          <Col>
            <Button className="btn signup" onClick={() => navigate("/signup")}>
              Register
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
