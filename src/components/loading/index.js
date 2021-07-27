import "./index.scss";
import { Row, Col } from "react-bootstrap";

// redux
import { useSelector } from "react-redux";
import spinner from "../../assets/gifs/confirmation.gif";

const Loading = () => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  return (
    <Row className="connect-wallet">
      <Col lg={6}>
        <img
          className="spinner"
          src={spinner}
          alt="spinner"
          width="144"
          height="144"
        />

        <div className="connect-wallet-text">Loading!</div>
        <div className="nothing-to-see-1">{dexName} LP Tokens</div>
      </Col>
    </Row>
  );
};

export default Loading;
