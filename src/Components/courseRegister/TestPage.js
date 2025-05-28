import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../style/TestPage.css";

function TestPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const language = location.state.course;
  const [data, setData] = useState(null);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [i, seti] = useState(1);
  const [queno, setQueno] = useState(1);
  const [button, setButton] = useState("Next");
  const [score, setScore] = useState({ level: {}, concepts: {}, skipped: {} });
  const [totalScore, setTotalScore] = useState({ level: {}, concepts: {} });

  // console.log(score);

  useEffect(() => {
    axios
      .get("http://localhost:6969/luwa/api/questions")
      .then((response) => {
        setData(response.data);
        if (response.data && response.data.length > 0) {
          setNextQuestion(response.data[0]);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error fetching questions");
      });
  }, []);

  function handleButton(type) {
    if (type === "dselected") {
      setSelected(null);
      return;
    }
    
    if (button === "Finish") {
      navigate("/");
    }

    if (!selected) {
      setScore((prevScore) => ({
        ...prevScore,
        skipped: {
          ...prevScore.skipped,
          [nextQuestion.id]: nextQuestion.id,
        },
      }));
    }

    // Total score
    if (selected) {
      // Level score
      setTotalScore((prevScore) => {
        return {
          ...prevScore,
          level: {
            ...prevScore.level,
            [nextQuestion.level]: prevScore.level[nextQuestion.level]
              ? prevScore.level[nextQuestion.level] + 1
              : 1,
          },
        };
      });

      // Concepts Score
      nextQuestion.concepts.forEach((concept) => {
        setTotalScore((prevScore) => {
          return {
            ...prevScore,
            concepts: {
              ...prevScore.concepts,
              [concept]: prevScore.concepts[concept]
                ? prevScore.concepts[concept] + 1
                : 1,
            },
          };
        });
      });
    }

    // Score
    if (button === "next" && nextQuestion.answer === selected) {
      // Level score
      setScore((prevScore) => {
        return {
          ...prevScore,
          level: {
            ...prevScore.level,
            [nextQuestion.level]: prevScore.level[nextQuestion.level]
              ? prevScore.level[nextQuestion.level] + 1
              : 1,
          },
        };
      });

      // Concepts Score
      nextQuestion.concepts.forEach((concept) => {
        setScore((prevScore) => {
          return {
            ...prevScore,
            concepts: {
              ...prevScore.concepts,
              [concept]: prevScore.concepts[concept]
                ? prevScore.concepts[concept] + 1
                : 1,
            },
          };
        });
      });
    }

    setSelected(null);
    if (data !== null && data.length > 0 && i < data.length) {
      let nextIndex = i;
      while (
        nextIndex < data.length &&
        !data[nextIndex].language.includes(language)
      ) {
        nextIndex++;
      }

      if (nextIndex < data.length) {
        setNextQuestion(data[nextIndex]);
        seti(nextIndex + 1);
        setQueno(queno + 1);
      }

      if (nextIndex >= data.length - 2) setButton("Finish");
    }
  }

  console.log(score);
  console.log(totalScore);
  console.log(score === totalScore);
  // console.log(score == totalScore);

  return (
    <Container className="test-Container">
      {nextQuestion !== null ? (
        <Container className="testpage-innerContainer">
          <Container className="questions">
            <h2 className="ques-no"> Question {queno} </h2>
            <h3 className="question"> {nextQuestion.question} </h3>
          </Container>
          <Container className="options">
            <Container
              className={`radio-btns ${selected === "A" ? "clicked" : ""}`}
              onClick={() => setSelected("A")}
            >
              <p>{nextQuestion.A}</p>
            </Container>
            <Container
              className={`radio-btns ${selected === "B" ? "clicked" : ""}`}
              onClick={() => setSelected("B")}
            >
              <p>{nextQuestion.B}</p>
            </Container>
            <Container
              className={`radio-btns ${selected === "C" ? "clicked" : ""}`}
              onClick={() => setSelected("C")}
            >
              <p>{nextQuestion.C}</p>
            </Container>
            <Container
              className={`radio-btns ${selected === "D" ? "clicked" : ""}`}
              onClick={() => setSelected("D")}
            >
              <p>{nextQuestion.D}</p>
            </Container>
          </Container>
          <Container className="button">
            <Button
              className="testpage-btn nxt-btn"
              onClick={() => handleButton("next")}
              disabled={!selected && button !== "Finish"}
            >
              {button}
            </Button>
            <div className="extra-btns">
              {button !== "Finish" ? (
                <Button
                  className="testpage-btn skip-btn"
                  onClick={() => handleButton("skip")}
                >
                  Skip
                </Button>
              ) : (
                <></>
              )}

              <Button
                className="testpage-btn ds-btn"
                onClick={() => handleButton("dselected")}
                disabled={!selected}
              >
                Deselect
              </Button>
            </div>
          </Container>
        </Container>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default TestPage;
