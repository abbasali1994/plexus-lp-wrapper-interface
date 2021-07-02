import "./index.scss";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { constants } from "../../../utils";

const history = {
  timestamp: "04/12/21 4:56pm",
  action: "Generate",
  amountPair: "47.324 WBTC/BADGER",
  pool: "SushiSwap LP Tokens",
  hash: "0x07...d5f0",
};

const DashboardHistoryComponent = () => {
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
      <DesktopDashboardHistory />
    ) : (
      <MobileDashboardHistory />
    );

  return element;
};

const MobileDashboardHistory = () => {
  return (
    <div className="main-wrapper-interface">
      {[...Array(3)].map((value, id) => (
        <div key={id} className="history">
          <div className="history-timestamp">{history.timestamp}</div>
          <div className="history-amount">
            <span className="history-action">{history.action} &nbsp;</span>
            {history.amountPair}
          </div>
          <div className="history-amount">{history.pool}</div>
          <div className="history-hash">Hash: {history.hash}</div>
        </div>
      ))}
    </div>
  );
};

const DesktopDashboardHistory = () => {
  return (
    <div className="dashboard-wrapper-interface">
      <div className="dashboard-table">
        <Row className="dashboard-table-header">
          <Col lg="3">Date</Col>
          <Col>Action</Col>
          <Col lg="2">Txn Hash</Col>
        </Row>
        <div className="dashboard-table-body">
          {[...Array(5)].map((value, id) => (
            <Row className="dashboard-table-row">
              <Col lg="3">{history.timestamp}</Col>
              <Col>
                <span className="dashboard-table-action">
                  {history.action} &nbsp;
                </span>
                {history.amountPair}&nbsp;{history.pool}
              </Col>
              <Col lg="2" className="dashboard-table-hash">
                {history.hash}
              </Col>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHistoryComponent;
