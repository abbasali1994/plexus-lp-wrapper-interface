import "./index.scss";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { constants, formatAddress } from "../../../utils";
import {
  displayAmountWithDecimals,
  formatTimestamp,
} from "../../../utils/wallet";
import NothingToSee from "../../nothing-to-see";
import Loading from "../../loading";

function sortByTimestamp(a, b) {
  if (a.timestamp && b.timestamp)
    return parseFloat(b.timestamp) - parseFloat(a.timestamp);
  return false;
}

const DashboardHistoryComponent = () => {
  let element = (
    <div className="main-wrapper-interface">
      <NothingToSee />
    </div>
  );
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });
  let { userSwaps } = useSelector((state) => state.wallet);
  const { selectedDex } = useSelector((state) => state.dexes);

  if (!userSwaps[selectedDex]) element = <Loading />;
  else if (userSwaps[selectedDex].length > 0)
    element =
      width > constants.width.mobile ? (
        <DesktopDashboardHistory
          history={userSwaps[selectedDex]
            .slice()
            .sort((a, b) => sortByTimestamp(a, b))}
        />
      ) : (
        <MobileDashboardHistory
          history={userSwaps[selectedDex]
            .slice()
            .sort((a, b) => sortByTimestamp(a, b))}
        />
      );

  return element;
};

const MobileDashboardHistory = ({ history }) => {
  return (
    <div className="main-wrapper-interface">
      {history.map((entry, id) => {
        const {
          amountIn,
          amountOut,
          tokenIn,
          tokenOut,
          action,
          timestamp,
          transaction,
        } = entry;
        const statement = `${displayAmountWithDecimals(amountIn, 2)} ${
          tokenIn.symbol
        } to ${displayAmountWithDecimals(amountOut, 2)} ${tokenOut.symbol}`;
        return (
          <div key={id} className="history">
            <div className="history-timestamp">
              {formatTimestamp(timestamp)}
            </div>
            <div className="history-amount">
              <span className="history-action">{action}&nbsp;</span>
              {statement}
            </div>
            <div
              className="history-hash"
              onClick={() =>
                window.open(constants.etherscanTxURL + transaction.id, "_blank")
              }
            >
              Hash: {formatAddress(transaction.id)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DesktopDashboardHistory = ({ history }) => {
  return (
    <div className="dashboard-wrapper-interface">
      <div className="dashboard-table">
        <Row className="dashboard-table-header">
          <Col lg="3">Date</Col>
          <Col>Action</Col>
          <Col lg="2">Txn Hash</Col>
        </Row>
        <div className="dashboard-table-body">
          {history.map((entry, id) => {
            const {
              amountIn,
              amountOut,
              tokenIn,
              tokenOut,
              action,
              timestamp,
              transaction,
            } = entry;
            const statement = `${displayAmountWithDecimals(amountIn)} ${
              tokenIn.symbol
            } to ${displayAmountWithDecimals(amountOut)} ${
              tokenOut.symbol
            } Tokens`;
            return (
              <Row className="dashboard-table-row" key={id}>
                <Col lg="3">{formatTimestamp(timestamp)}</Col>
                <Col>
                  <span className="dashboard-table-action">
                    {action} &nbsp;
                  </span>
                  {statement}
                </Col>
                <Col
                  lg="2"
                  className="dashboard-table-hash"
                  onClick={() =>
                    window.open(
                      constants.etherscanTxURL + transaction.id,
                      "_blank"
                    )
                  }
                >
                  {formatAddress(transaction.id)}
                </Col>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardHistoryComponent;
