import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useDataStore } from './orchestrationService/DataStore';
import "../style/Analysis.css";

function Analysis() {

  const { getData, updateData } = useDataStore();

  const score = getData("score");
  const [pps, setPPS] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:6969/luwa/api/calculatePPS", {
        score,
      })
      .then((response) => {
        setPPS(response.data);
      })
      .catch((error) => {
        console.log("Error analyzing data" + error);
        alert("Error analyzing data");
      });
  }, [score]);

  useEffect(() => {
    updateData("pps", pps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pps]);

  return (
    <Container className='analysis-container'>
        <Container className='analysis-innerContainer'>
            <h1>Assessment Results</h1>
        </Container>
    </Container>
  )
}

export default Analysis;