import "./index.scss";
import { Row, Col } from "react-bootstrap";

// redux
import { useSelector } from "react-redux";

import glasses from "../../assets/gifs/empty.gif";
const NothingToSee = () => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  return (
    <Row className="nothing-to-see">
      <Col lg={6}>
        <img src={glasses} alt="wallet-icon" />
        <div className="nothing-to-see-text">
          <div className="nothing-to-see-text-1">Nothing to see here!</div>
          <div className="nothing-to-see-text-2">
            You don’t have any {dexName} LP Tokens
          </div>
          <div className="nothing-to-see-text-3">Why not make some?</div>
        </div>
      </Col>
    </Row>
  );
};

export default NothingToSee;
