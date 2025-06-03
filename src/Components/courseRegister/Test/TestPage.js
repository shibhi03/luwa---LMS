import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../../../commonComponents/Loader";
import { useDataStore } from "../../orchestrationService/DataStore";
import { useOrchestrator } from "../../orchestrationService/Orchestrator";

import "../../../style/TestPage.css";

function TestPage() {
  const location = useLocation();

  const { getData, updateData } = useDataStore();
  const { routeNext } = useOrchestrator();

  const language1 = getData("course");
  const language2 = getData("knownDomain");

  console.log(language1 + " " + language2);

  const [data, setData] = useState(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [queno, setQueno] = useState(1);
  const [button, setButton] = useState("Next");
  const [selected, setSelected] = useState(-1);
  const [score, setScore] = useState({ correct: {}, attended: {} });

  useEffect(() => {
    if (!data) {
      axios
        .post("http://localhost:6969/luwa/api/mcqs", {
          lang1: language1,
          lang2: language2,
        })
        .then((response) => {
          setData(response.data);
          console.log("Data fetched successfully");
        })
        .catch((error) => {
          console.error("Error fetching questions" + error);
          alert("Error fetching questions");
        });
    }
    // eslint-disable-next-line
  }, [language1, language2]);

  const categories = data ? Object.keys(data) : [];
  const currentCategory = categories.length > 0 ? categories[currentCategoryIndex] : null;
  const currentCategoryQuestions = data ? data[currentCategory] : [];
  const currentQuestion =
    currentCategoryQuestions.length > 0
      ? currentCategoryQuestions[currentQuestionIndex]
      : null;

  function handleButton(type) {
    if (type === "dselected") {
      setSelected(-1);
      return;
    }

    // Handle answered questions
    if (selected >= 0 || type !== "skipped") {
      // Number of questions attended
      setScore((prevScore) => ({
        ...prevScore,
        attended: {
          ...prevScore.attended,
          [currentQuestion.level]:
            (prevScore.attended[currentQuestion.level] || 0) + 1,
        },
      }));

      const isCorrect =
        currentQuestion.options[selected] === currentQuestion.answer;

      // Number of correctly answered questions
      if (isCorrect) {
        setScore((prevScore) => ({
          ...prevScore,
          correct: {
            ...prevScore.correct,
            concept: {
              ...prevScore.correct.concept,
              [currentQuestion.concept]:
                (prevScore.correct[currentQuestion.concept] || 0) + 1,
            },
            level: {
              ...prevScore.correct.level,
              [currentQuestion.level]:
                (prevScore.correct[currentQuestion.level] || 0) + 1,
            }
          },
        }));
        // Skip to next category if the answer is correct and is not the last category.
        if (currentCategoryIndex < categories.length - 1) {
          setCurrentCategoryIndex(currentCategoryIndex + 1);
          setCurrentQuestionIndex(0);
          setQueno(queno + 1);
          setSelected(-1);
          return;
        }
      }
    }

    // complete and get analysis
    if (button === "Finish") {
      updateData("score", score);
      routeNext(location.pathname);
      return;
    }

    // Move to next question in the current category
    setSelected(-1);
    if (currentQuestionIndex < currentCategoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQueno(queno + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      // Move to next category if no more questions in current category
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
      setQueno(queno + 1);
    } else {
      // No more categories or questions left
      setButton("Finish");
    }
  }

  return (
    <Container className="test-Container">
      {currentQuestion ? (
        <Container className="testpage-innerContainer">
          <Container className="questions">
            <h2 className="ques-no"> Question {queno} </h2>
            <h2 className="ques-no"> category {currentCategory} </h2>
            <h3 className="question"> {currentQuestion.question} </h3>
          </Container>
          <Container className="options">
            {currentQuestion.options.map((option, index) => (
              <Container
                key={index}
                className={`radio-btns ${selected === index ? "clicked" : ""}`}
                onClick={() => setSelected(index)}
              >
                <p>{option}</p>
              </Container>
            ))}
          </Container>
          <Container className="button">
            <Button
              className="testpage-btn nxt-btn"
              onClick={() => handleButton("next")}
              disabled={selected === -1 && button !== "Finish"}
            >
              {button}
            </Button>
            <div className="extra-btns">
              {button !== "Finish" ? (
                <Button
                  className="testpage-btn skip-btn"
                  onClick={() => handleButton("skipped")}
                >
                  Skip
                </Button>
              ) : (
                <></>
              )}

              <Button
                className="testpage-btn ds-btn"
                onClick={() => handleButton("dselected")}
              >
                Deselect
              </Button>
            </div>
          </Container>
        </Container>
      ) : (
        <Loader text="Generating Questions" />
      )}
    </Container>
  );
}

export default TestPage;
