import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Courses.css";

export default function Course() {
  const [coursesList, setCoursesList] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:6969/luwa/api/courses")
      .then((response) => {
        setCoursesList(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Error Fetching courses");
      });
  });

  const navigate = useNavigate();

  const [courseSelected, setCourseSelected] = useState();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selected, setSelected] = useState(false);

  return (
    <Container className="coursesContainer">
      <Container className="innerContainer">
        <Row>
          <h1 className="course-text ">Choose a course to start learning.</h1>
        </Row>
        <Row className="container courseContainer">
          {coursesList !== null ? (
            coursesList
              .filter((_, index) => index !== coursesList.length - 1)
              .map((course, index) => (
              <Col
                key={course.id}
                className={`course ${selectedIndex === index ? "clicked" : ""}`}
                onClick={() => {
                  setSelectedIndex(index);
                  setSelected(true);
                  setCourseSelected(course.id);
                }}
              >
                <img
                  className="course-img"
                  src={course.img}
                  alt={course.name}
                />
                <h2 className="course-name">{course.name}</h2>
              </Col>
            ))
          ) : (
            <div>Loading...</div>
          )}
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
            onClick={() =>
              navigate("/signup/CourseRegister/known-domain", {
                state: { coursesList, courseSelected },
              })
            }
          >
            Next
          </Button>
        </Row>
      </Container>
    </Container>
  );
}
