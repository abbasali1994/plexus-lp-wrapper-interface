import "./index.scss";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// React Bootstrap
import { Col, Row } from "react-bootstrap";

import { LpTokenIconView } from "../../token-selector";
import { getAllTokens, getPriceId } from "../../../utils/token";
import { constants } from "../../../utils";
import { navigate } from "hookrouter";
import { setSearchCaller, setSelectedToken } from "../../../redux/tokens";
import { setActiveDex } from "../../../redux/dex";
import {
  isInViewport,
  formatAmount,
} from "../../../utils/display";

const tokens = getAllTokens();

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
  const { balances } = useSelector((state) => state.wallet);
  const { pricesUSD } = useSelector((state) => state.prices);
  const [tokensList] = useState(tokens);
  const dispatch = useDispatch();
  const handleGenerateClick = (token, selectedDex) => {
    dispatch(setActiveDex({ selectedDex }));
    dispatch(setSearchCaller({ searchCaller: constants.inputToken }));
    dispatch(setSelectedToken(token));
    navigate("/");
  };
  function sortByBalance(a, b) {
    if (balances[b.symbol] && balances[a.symbol])
      return (
        parseFloat(balances[b.symbol].balance) -
        parseFloat(balances[a.symbol].balance)
      );
    return false;
  }

  return (
    <div className="main-wrapper-interface">
      {tokensList
        .sort((a, b) => sortByBalance(a, b))
        .map((token, id) => {
          if (!balances[token.symbol] || balances[token.symbol].balance <= 0)
            return "";
          let displayToken = {};
          Object.assign(displayToken, token);
          displayToken.balance = parseFloat(
            balances[token.symbol].balance.replace(",", "")
          );
          displayToken.tokenUSDValue = pricesUSD[getPriceId(token)]
            ? pricesUSD[getPriceId(token)].usd
            : 1;
          return (
            <div key={id} className="dashboard-pair">
              <GeneratingLPTokenMobileView token={displayToken} />
              <Row>
                <Col>
                  <button
                    className="dashboard-token-btn"
                    onClick={() => handleGenerateClick(displayToken, 0)}
                  >
                    Generate Sushi LP
                  </button>
                </Col>
                <Col>
                  <button
                    className="dashboard-token-btn"
                    onClick={() => handleGenerateClick(displayToken, 1)}
                  >
                    Generate Uni LP
                  </button>
                </Col>
              </Row>
            </div>
          );
        })}
    </div>
  );
};

const DesktopDashboardTokens = () => {
  const { balances } = useSelector((state) => state.wallet);
  const { pricesUSD } = useSelector((state) => state.prices);
  const [tokensList, setTokensList] = useState(tokens);
  const [cursor, setCursor] = useState(-1);
  const divRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    function searchCriteria(token) {
      if (!balances[token.symbol] || balances[token.symbol].balance <= 0)
        return false;
      return true;
    }
    const filteredList = tokens.filter((token) => searchCriteria(token));
    setTokensList(filteredList);
  }, [balances]);

  function handleKeyDown(e) {
    const box = document.getElementsByClassName("dashboard-table-body")[0];
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      const token = document.getElementById("dashboard-token-" + (cursor - 1));
      setCursor(cursor - 1);
      if (!isInViewport(token, box)) token.scrollIntoView();
    } else if (e.keyCode === 40 && cursor < tokensList.length - 1) {
      const token = document.getElementById("dashboard-token-" + (cursor + 1));
      setCursor(cursor + 1);
      if (!isInViewport(token, box)) token.scrollIntoView();
    } else if (e.key === "Enter" && cursor > -1) {
      handleGenerateClick(tokensList[cursor]);
    }
  }
  function sortByBalance(a, b) {
    if (balances[b.symbol] && balances[a.symbol])
      return (
        parseFloat(balances[b.symbol].balance) -
        parseFloat(balances[a.symbol].balance)
      );
    return false;
  }
  function handleGenerateClick(token) {
    dispatch(setSearchCaller({ searchCaller: constants.inputToken }));
    dispatch(setSelectedToken(token));
    navigate("/");
  }
  useEffect(() => {
    divRef.current.focus();
  });
  return (
    <div
      className="dashboard-wrapper-interface"
      tabIndex="0"
      ref={divRef}
      onKeyDown={handleKeyDown}
    >
      <div className="dashboard-table">
        <Row className="dashboard-table-header">
          <Col>Token</Col>
          <Col>Wallet Balance</Col>
          <Col>USD Value</Col>
          <Col lg="4">Actions</Col>
        </Row>
        <div className="dashboard-table-body">
          {tokensList
            .sort((a, b) => sortByBalance(a, b))
            .map((token, id) => {
              let displayToken = {};
              Object.assign(displayToken, token);
              displayToken.balance = parseFloat(
                balances[token.symbol].balance.replace(",", "")
              );
              displayToken.tokenUSDValue = pricesUSD[getPriceId(token)]
                ? pricesUSD[getPriceId(token)].usd
                : 1;
              return (
                <GeneratingLPTokenDesktopView
                  key={id}
                  token={displayToken}
                  handleGenerateClick={handleGenerateClick}
                  tokenSelected={cursor === id ? "token-selected" : ""}
                  tokenID={"dashboard-token-" + id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

const GeneratingLPTokenMobileView = ({ token }) => {
  return (
    <div className="dashboard-lp-view">
      <div className="select-token">
        <LpTokenIconView tokenIcon={token.tokenIcon} tokenIconSize={51} />
      </div>
      <div className="lp-pair-info">
        <div className="dashboard-pair-text">{token.symbol}</div>
        <div className="lp-pair-desc">
          <div className="dashboard-pair-dex">
            {formatAmount(token.balance)}&nbsp;{token.symbol}
          </div>
          <div className="dashboard-pair-amount">
            ${formatAmount(token.balance * token.tokenUSDValue)}
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneratingLPTokenDesktopView = ({
  token,
  tokenID,
  tokenSelected,
  handleGenerateClick,
}) => {
  return (
    <Row id={tokenID} className={`dashboard-table-row ${tokenSelected}`}>
      <Col className="dashboard-table-tokens">
        <Row>
          <Col>
            <LpTokenIconView tokenIcon={token.tokenIcon} tokenIconSize={34} />
          </Col>
          <Col>
            <div className="dashboard-table-token-name">{token.name}</div>
            <div className="dashboard-table-token-symbol">{token.symbol}</div>
          </Col>
        </Row>
      </Col>
      <Col className="dashboard-table-token-balance">
        {formatAmount(token.balance)}&nbsp;{token.symbol}
      </Col>
      <Col className="dashboard-table-pair-amount">
        ${formatAmount(token.balance * token.tokenUSDValue)}
      </Col>
      <Col lg="4">
        <button
          className="dashboard-table-token-btn"
          onClick={() => handleGenerateClick(token)}
        >
          Generate Lp tokens
        </button>
      </Col>
    </Row>
  );
};

export default DashboardTokensComponent;
