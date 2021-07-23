import "./index.scss";
import { useState, useEffect } from "react";
// React Bootstrap
import { Col, Row } from "react-bootstrap";

import { LpTokenIconView } from "../../token-selector";
import { getAllTokens } from "../../../utils/token";
import { constants } from "../../../utils";

const tokens = getAllTokens();
const token1 = tokens.find((token) => token.symbol === "eth");

const DashboardTokensComponent = () => {
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
      <DesktopDashboardTokens />
    ) : (
      <MobileDashboardTokens />
    );

  return element;
};

const MobileDashboardTokens = () => {
  let lpTokens = { token1 };
  return (
    <div className="main-wrapper-interface">
      {[...Array(5)].map((value, id) => (
        <div key={id} className="dashboard-pair">
          <GeneratingLPTokenMobileView lpTokens={lpTokens} />
          <Row>
            <Col>
              <button className="dashboard-token-btn">Generate Sushi LP</button>
            </Col>
            <Col>
              <button className="dashboard-token-btn">Generate Uni LP</button>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

const DesktopDashboardTokens = () => {
  let lpTokens = { token1 };
  return (
    <div className="dashboard-wrapper-interface">
      <div className="dashboard-table">
        <Row className="dashboard-table-header">
          <Col>Token</Col>
          <Col>Wallet Balance</Col>
          <Col>USD Value</Col>
          <Col lg="4">Actions</Col>
        </Row>
        <div className="dashboard-table-body">
          {[...Array(5)].map((value, id) => (
            <GeneratingLPTokenDesktopView lpTokens={lpTokens} />
          ))}
        </div>
      </div>
    </div>
  );
};

const GeneratingLPTokenMobileView = ({ lpTokens }) => {
  const { token1 } = lpTokens;

  return (
    <div className="dashboard-lp-view">
      <div className="select-token">
        <LpTokenIconView tokenIcon={token1.tokenIcon} tokenIconSize={51} />
      </div>
      <div className="lp-pair-info">
        <div className="dashboard-pair-text">{token1.symbol}</div>
        <div className="lp-pair-desc">
          <div className="dashboard-pair-dex">4.5324 LP Tokens</div>
          <div className="dashboard-pair-amount">$4,623.42</div>
        </div>
      </div>
    </div>
  );
};

const GeneratingLPTokenDesktopView = ({ lpTokens }) => {
  const { token1 } = lpTokens;

  return (
    <Row className="dashboard-table-row">
      <Col className="dashboard-table-tokens">
        <Row>
          <Col>
            <LpTokenIconView tokenIcon={token1.tokenIcon} tokenIconSize={34} />
          </Col>
          <Col>
            <div className="dashboard-table-token-name">{token1.name}</div>
            <div className="dashboard-table-token-symbol">
              {token1.symbol}
            </div>
          </Col>
        </Row>
      </Col>
      <Col className="dashboard-table-token-balance">
        {token1.balance}&nbsp;{token1.symbol}
      </Col>
      <Col className="dashboard-table-pair-amount">$4,623.42</Col>
      <Col lg="4">
        <button className="dashboard-table-token-btn">
          Generate Lp tokens
        </button>
      </Col>
    </Row>
  );
};

export default DashboardTokensComponent;
