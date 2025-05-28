import { Container } from "react-bootstrap";
import "../style/Loader.css";

export default function Loader(props) {
    const displayText = props ? props.text : "Loading";
    return (
        <Container className="loading">
        <div className="banter-loader">
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
        </div>
        <div className="text">
            <h2>{displayText} . . .</h2>
        </div>
        </Container>
  );
}
