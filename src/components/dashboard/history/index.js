import "./index.scss";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { constants, formatAddress } from "../../../utils";
import {
  formatAmount,
  formatTimestamp,
  isInViewport,
} from "../../../utils/display";
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
  function handleClick(transaction) {
    window.open(constants.etherscanTxURL + transaction.id, "_blank");
  }
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
        const statement = `${formatAmount(amountIn, 2)} ${
          tokenIn.symbol
        } to ${formatAmount(amountOut, 2)} ${tokenOut.symbol}`;
        return (
          <div
            key={id}
            className="history"
            onClick={(transaction) => handleClick(transaction)}
          >
            <div className="history-timestamp">
              {formatTimestamp(timestamp)}
            </div>
            <div className="history-amount">
              <span className="history-action">{action}&nbsp;</span>
              {statement}
            </div>
            <div className="history-hash">
              Hash: {formatAddress(transaction.id)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DesktopDashboardHistory = ({ history }) => {
  const divRef = useRef(null);
  const [cursor, setCursor] = useState(-1);
  function handleKeyDown(e) {
    const box = document.getElementsByClassName("dashboard-table-body")[0];
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      const token = document.getElementById("dashoard-history-" + (cursor - 1));
      setCursor(cursor - 1);
      if (!isInViewport(token, box)) token.scrollIntoView();
    } else if (e.keyCode === 40 && cursor < history.length - 1) {
      const token = document.getElementById("dashoard-history-" + (cursor + 1));
      setCursor(cursor + 1);
      if (!isInViewport(token, box)) token.scrollIntoView();
    } else if (e.key === "Enter" && cursor > -1) {
      handleClick(history[cursor].transaction);
    }
  }
  function handleClick(transaction) {
    window.open(constants.etherscanTxURL + transaction.id, "_blank");
  }
  useEffect(() => {
    divRef.current.focus();
  });
  return (
    <div
      className="dashboard-wrapper-interface"
      ref={divRef}
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div className="dashboard-table">
        <Row className="dashboard-table-header">
          <Col lg="3">Date</Col>
          <Col>Action</Col>
          <Col lg="2">Txn Hash</Col>
        </Row>
        <div className="dashboard-table-body">
          {history.map((entry, id) => {
            const {
              action,
              statement,
              timestamp,
              transaction,
            } = entry;      
            return (
              <Row
                id={`dashoard-history-${id}`}
                className={`dashboard-table-row ${
                  cursor === id ? "token-selected" : ""
                }`}
                key={id}
                onClick={() =>
                  window.open(
                    constants.etherscanTxURL + transaction.id,
                    "_blank"
                  )
                }
              >
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
