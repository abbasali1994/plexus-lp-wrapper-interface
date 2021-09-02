import "./index.scss";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Pagination } from "react-bootstrap";
import { constants, formatAddress } from "../../../utils";
import { formatTimestamp, isInViewport } from "../../../utils/display";
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
        const { action, statement, timestamp, transaction } = entry;
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
  const [activePage, setActivePage] = useState(1);
  function handleKeyDown(e) {
    const box = document.getElementsByClassName(
      "dashboard-history-table-body"
    )[0];
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
        <div className="dashboard-history-table-body">
          {history
            .slice((activePage - 1) * 50, activePage * 50)
            .map((entry, id) => {
              const { action, statement, timestamp, transaction } = entry;
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
                  <Col lg="2" className="dashboard-table-hash">
                    {formatAddress(transaction.id)}
                  </Col>
                </Row>
              );
            })}
        </div>
      </div>
      <PaginationComponent
        activePage={activePage}
        pageCount={Math.floor(history.length / 50) + 1}
        setActivePage={setActivePage}
      />
    </div>
  );
};

const PaginationComponent = ({ activePage, pageCount, setActivePage }) => {
  const items = [];
  const start = Math.max(1, activePage - 3);
  const end = Math.min(5, pageCount);
  for (let number = start; number <= end; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        onClick={() => setActivePage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }
  return (
    <Pagination>
      <Pagination.First
        disabled={activePage === 1}
        onClick={() => setActivePage(1)}
      />
      <Pagination.Prev
        disabled={activePage === 1}
        onClick={() => setActivePage(activePage - 1)}
      />
      {start !== 1 && <Pagination.Ellipsis />}
      {items}
      {end !== pageCount && <Pagination.Ellipsis />}
      <Pagination.Next
        disabled={activePage === pageCount}
        onClick={() => setActivePage(activePage + 1)}
      />
      <Pagination.Last
        disabled={activePage === pageCount}
        onClick={() => setActivePage(pageCount)}
      />
    </Pagination>
  );
};
export default DashboardHistoryComponent;
