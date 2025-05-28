import {  useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useDataStore } from "../orchestrationService/DataStore";
import { useOrchestrator } from "../orchestrationService/Orchestrator";
import "../../style/Courses.css";

export default function KnownDomain() {
  const location = useLocation();

  const { getData, updateData } = useDataStore();
  const { routeNext, routeBack } = useOrchestrator();

  const excluded = getData("courseIndex");
  const courseList = getData("coursesList");

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selected, setSelected] = useState(false);

  // Handle button click event
  const handleButton = () => {
    updateData("knownDomain", selectedDomain); // Add value (knownDamain) to the data store
    routeNext(location.pathname); // Navigate to the next page
  };

  return (
    <Container className="coursesContainer">
      <Container className="innerContainer">
        <Row>
          <h1 className="course-text ">Choose any one language you know</h1>
        </Row>
        <Row className="container courseContainer">
          {courseList
            .filter((_, index) => index + 1 !== excluded)
            .map((course, index) => (
              <Col
                key={course.id}
                className={`course ${selectedIndex === index ? "clicked" : ""}`}
                onClick={() => {
                  setSelectedIndex(index);
                  setSelected(true);
                  setSelectedDomain(course.name);
                }}
              >
                <img
                  className="course-img"
                  src={course.img}
                  alt={course.name}
                />
                <h2 className="course-name">{course.name}</h2>
              </Col>
            ))}
        </Row>
        <Row className="selected">
          <h3 className="no-crs-selected">
            Selected: {selected ? <span>1</span> : <span>0</span>}/1
          </h3>
        </Row>
        <Row className="next-btn">
          <Button
            className="nxt-btn btn"
            disabled={!selected}
            onClick={handleButton}
          >
            Next
          </Button>
          <Button
            className="back-btn btn"
            style={{
              backgroundColor: "#FF914D",
            }}
            onClick={() => routeBack(location.pathname)}
          >
            Back
          </Button>
        </Row>
      </Container>
    </Container>
  );
}
