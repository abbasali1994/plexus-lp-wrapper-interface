import "./index.scss";
import { Row, Col } from "react-bootstrap";

// redux
import { useSelector } from "react-redux";

import glasses from "../../assets/images/glasses.svg";
const NothingToSee = () => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  return (
    <Row className="connect-wallet">
      <Col lg={6}>
        <img src={glasses} alt="wallet-icon" />
        <div className="nothing-to-see">
          <div className="connect-wallet-text">Nothing to see here!</div>
          <div className="nothing-to-see-1">
            You don’t have any {dexName} LP Tokens
          </div>
          <div className="nothing-to-see-2">Why not make some?</div>
        </div>
      </Col>
    </Row>
  );
};

export default NothingToSee;
