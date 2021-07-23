import "./index.scss";
import { useState, useEffect } from "react";
// React Bootstrap
import { Col, Row } from "react-bootstrap";

// Dashboard Header
import { LpTokenIconView } from "../../token-selector";
import pair from "../../../assets/images/pair.svg";
import { getAllTokens } from "../../../utils/token";
import { constants } from "../../../utils";
import { MobileDexes } from "../../dex-buttons";

const tokens = getAllTokens();
const token1 = tokens.find((token) => token.symbol === "eth");
const token2 = tokens.find((token) => token.symbol === "usdc");

const DashboardPairsComponent = () => {
  let element = null;
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });

  element =
    width > constants.width.mobile ? (
      <DesktopDashboardPairs />
    ) : (
      <MobileDashboardPairs />
    );

  return element;
};

const MobileDashboardPairs = () => {
  let lpTokens = { token1, token2 };
  return (
    <div className="main-wrapper-interface">
      <MobileDexes />
      {[...Array(5)].map((value, id) => (
        <div key={id} className="dashboard-pair">
          <GeneratingLPTokenMobileView lpTokens={lpTokens} />
          <Row>
            <Col>
              <button className="dashboard-pair-btn">Unwrap</button>
            </Col>
            <Col>
              <button className="dashboard-pair-btn">Remix</button>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

const DesktopDashboardPairs = () => {
  let lpTokens = { token1, token2 };
  return (
    <div className="dashboard-wrapper-interface">
      <div className="dashboard-table">
        <Row className="dashboard-table-header">
          <Col>Tokens</Col>
          <Col>Pair</Col>
          <Col>USD Value</Col>
          <Col lg="4">Actions</Col>
        </Row>
        <div className="dashboard-table-body">
          {[...Array(5)].map((value, id) => (
            <GeneratingLPTokenDesktopView key={id} lpTokens={lpTokens} />
          ))}
        </div>
      </div>
    </div>
  );
};

const GeneratingLPTokenMobileView = ({ lpTokens }) => {
  const { token1, token2 } = lpTokens;
  const lpPair = token1.symbol + "/" + token2.symbol;

  return (
    <div className="dashboard-lp-view">
      <div className="select-token">
        <LpTokenIconView tokenIcon={token1.tokenIcon} tokenIconSize={51} />
      </div>
      <img
        className="dashboard-pair-icon"
        src={pair}
        width="16"
        height="46"
        alt="pair"
      />
      <div className="select-token">
        <LpTokenIconView tokenIcon={token2.tokenIcon} tokenIconSize={51} />
      </div>
      <div className="lp-pair-info">
        <div className="dashboard-pair-text">{lpPair}</div>
        <div className="lp-pair-desc">
          <div className="dashboard-pair-dex">4.5324 LP Tokens</div>
          <div className="dashboard-pair-amount">$4,623.42</div>
        </div>
      </div>
    </div>
  );
};

const GeneratingLPTokenDesktopView = ({ lpTokens }) => {
  const { token1, token2 } = lpTokens;
  const lpPair = token1.symbol + "/" + token2.symbol;

  return (
    <Row className="dashboard-table-row">
      <Col className="dashboard-table-tokens">
        <LpTokenIconView tokenIcon={token1.tokenIcon} tokenIconSize={45} />
        <img
          className="dashboard-table-pair-icon"
          src={pair}
          width="16"
          height="16"
          alt="pair"
        />
        <LpTokenIconView tokenIcon={token2.tokenIcon} tokenIconSize={45} />
      </Col>
      <Col>
        <div className="dashboard-table-pair-text">{lpPair}</div>
        <div className="dashboard-table-pair-dex">4.5324 LP Tokens</div>
      </Col>
      <Col>
        <div className="dashboard-table-pair-amount">$4,623.42</div>
      </Col>
      <Col lg="4">
        <Row>
          <Col>
            <button className="dashboard-pair-btn">Unwrap</button>
          </Col>
          <Col>
            <button className="dashboard-pair-btn">Remix</button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default DashboardPairsComponent;
