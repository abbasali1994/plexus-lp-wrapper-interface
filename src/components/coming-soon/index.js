import "./index.scss";
import { Row, Col } from "react-bootstrap";

import glasses from "../../assets/gifs/empty.gif";
const ComingSoon = () => {
  return (
    <div className="main-section">
      <Col lg="12" className="main-dashboard-wrapper">
      <Row className="coming-soon">
          <Col lg={6}>
            <img src={glasses} alt="wallet-icon" />
            <div className="nothing-to-see">
              <div className="connect-wallet-text">Coming Soon</div>
            </div>
          </Col>
        </Row>
      </Col>
        
    </div>
  );
};

export default ComingSoon;
