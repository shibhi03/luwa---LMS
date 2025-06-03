import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import { useDataStore } from "./orchestrationService/DataStore";
import "../style/Analysis.css";
import Loader from "../commonComponents/Loader";
import { useOrchestrator } from "./orchestrationService/Orchestrator";
import { useLocation } from "react-router-dom";

function Analysis() {
  const { getData, updateData } = useDataStore();
  const { routeNext } = useOrchestrator();

  const location = useLocation();

  const score = getData("score");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    axios
      .post("http://localhost:6969/luwa/api/calculatePPS", {
        score,
      })
      .then((response) => {
        setAnalysis(response.data);
      })
      .catch((error) => {
        console.log("Error analyzing data" + error);
        alert("Error analyzing data");
      });
  }, [score]);

  useEffect(() => {
    if (analysis) {
      updateData("analysis", analysis);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis]);

  return (
    <Container className="analysis-container">
      {analysis ? (
        <Container
          className="analysis-innerContainer innerContainer"
          style={{ overflowY: "auto" }}
        >
          {/* Scores Section */}
          <Container className="score-container">
            <Container className="score">
              <h1 className="score-title">Programming Proficiency Score</h1>
              <div className="score-value">{analysis.PPS}</div>
            </Container>
            <Container className="score">
              <h1 className="score-title">Weighted Correct Score</h1>
              <div className="score-value">{analysis.WCS}</div>
            </Container>
            {analysis.WCR && (
              <Container className="score">
                <h1 className="score-title">Weighted Correct Ratio</h1>
                <div className="score-value">{analysis.WCR}</div>
              </Container>
            )}
            <Container className="score">
              <h1 className="score-title">Accuracy</h1>
              <div className="score-value">{analysis.AC}</div>
            </Container>
            <Container className="score">
              <h1 className="score-title">Conceptual Diversity</h1>
              <div className="score-value">{analysis.CD || analysis.LD}</div>
            </Container>
          </Container>

          {/* Insights Section */}
          {analysis.Insights && analysis.Insights.length > 0 && (
            <Container className="insights-container">
              <h2 className="insights-title">Performance Insights</h2>
              <div className="insights-list">
                {analysis.Insights.map((insight, index) => (
                  <div key={index} className="insight-card">
                    <div className="insight-area">{insight.area}</div>
                    <div className="insight-text">{insight.insight}</div>
                  </div>
                ))}
              </div>
            </Container>
          )}
          <Button className="testpage-btn nxt-btn" onClick={() => {routeNext(location.pathname)}}>
            Next
          </Button>
        </Container>
      ) : (
        <Loader text="Analyzing" />
      )}
    </Container>
  );
}

export default Analysis;