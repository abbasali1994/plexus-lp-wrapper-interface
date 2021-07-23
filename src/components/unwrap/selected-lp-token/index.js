import "./index.scss";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import pair from "../../../assets/images/pair.svg";
import { LpTokenIconView } from "../../token-selector";
import { useSelector } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import { constants, tokenViewTypes } from "../../../utils";
import TokenSelector from "../../token-selector";
import TransactionButton from "../../transaction-button";

const SelectedLpToken = (props) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });

  if (width < constants.width.mobile) return <MobileWrapper {...props} />;
  return <DesktopWrapper {...props} />;
};

const DesktopWrapper = () => {
  const {
    selectedLpTokenPair,
    lpTokenPairs,
    outputTokenValue,
    outputTokenValueUSD,
    lpToken1Value,
    lpToken2Value,
  } = useSelector((state) => state.unwrap);
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const { lpToken1, lpToken2 } = lpTokenPairs[selectedDex][selectedLpTokenPair];
  const lpPairName = lpToken1.symbol + "/" + lpToken2.symbol;
  const space1 =
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const space3 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const space4 = "&nbsp;&nbsp;";
  return (
    <>
      <div className="main-wrapper-header ">
        <span className="main-header-text">
          Unwrap {lpPairName.toUpperCase()} LP Tokens
        </span>
      </div>
      <div className="main-wrapper-interface">
        <Row className="unwrap-row">
          <Col className="unwrap-tokens">
            <LpTokenIconView
              tokenIcon={lpToken1.tokenIcon}
              tokenIconSize={45}
            />
            <img
              className="unwrap-pair-icon"
              src={pair}
              width="16"
              height="16"
              alt="pair"
            />
            <LpTokenIconView
              tokenIcon={lpToken2.tokenIcon}
              tokenIconSize={45}
            />
          </Col>
          <Col>
            <div className="unwrap-pair-text">{lpPairName}</div>
            <div className="unwrap-pair-dex">4.5324 {dexName} LP Tokens</div>
          </Col>
        </Row>
        <div className="input-token-section">
          <div className="token-label">Output Token</div>
          <TokenSelector viewType={tokenViewTypes.outputToken} />
        </div>
        <div
          className="unwrap-txn-details-header"
          style={{ visibility: !outputTokenValue ? "hidden" : "" }}
        >
          Details
        </div>
        <div
          className="unwrap-txn-details"
          style={{ visibility: !outputTokenValue ? "hidden" : "" }}
        >
          <div className="unwrap-txn-details-line">
            <span className="unwrap-txn-details-label1">
              Unwrapping:{ReactHtmlParser(space3)}
            </span>
            <br className="txn-details-line-break" />
            <span className="unwrap-txn-details-label2">
              4.5324 {lpPairName}
              {ReactHtmlParser(space4)}
            </span>
            <span className="unwrap-txn-details-label4">
              {ReactHtmlParser(space4)}
              {dexName} LP Tokens
            </span>
            <br />
            <span className="unwrap-txn-details-label3">
              {ReactHtmlParser(space1)}
              {`${lpToken1Value} ${lpToken1.symbol} // ${lpToken2Value} ${lpToken2.symbol}`}
            </span>
          </div>
          <div className="unwrap-txn-details-line">
            <span className="unwrap-txn-details-label1">
              Recieving:{ReactHtmlParser(space3)}
              {ReactHtmlParser(space4)}
              {ReactHtmlParser(space4)}
            </span>
            <br className="txn-details-line-break" />
            <span className="unwrap-txn-details-label2">
              {outputTokenValue}
            </span>
            <span className="unwrap-txn-details-label3">
              {ReactHtmlParser(space4)}
              {outputTokenValueUSD}
            </span>
          </div>
        </div>
        <div className="input-btn">
          <TransactionButton viewType={tokenViewTypes.outputButton} />
        </div>
      </div>
    </>
  );
};

const MobileWrapper = () => {
  const { selectedLpTokenPair, lpTokenPairs } = useSelector(
    (state) => state.unwrap
  );
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const { lpToken1, lpToken2 } = lpTokenPairs[selectedDex][selectedLpTokenPair];
  const lpPairName = lpToken1.symbol + "/" + lpToken2.symbol;

  return (
    <div className="main-wrapper-interface">
      <Row className="unwrap-row">
        <Col className="unwrap-tokens">
          <LpTokenIconView tokenIcon={lpToken1.tokenIcon} tokenIconSize={45} />
          <img
            className="unwrap-pair-icon"
            src={pair}
            width="16"
            height="16"
            alt="pair"
          />
          <LpTokenIconView tokenIcon={lpToken2.tokenIcon} tokenIconSize={45} />
        </Col>
        <Col>
          <div className="unwrap-pair-text">{lpPairName}</div>
          <div className="unwrap-pair-amount">$4,623.42</div>
        </Col>
        <Col className="unwrap-pair-dex">4.5324 {dexName} LP Tokens</Col>
      </Row>
      <div className="input-token-section">
        <div className="unwrap-token-label">Output Token</div>
        <TokenSelector viewType={tokenViewTypes.outputToken} />
      </div>

      <div className="input-btn">
        <TransactionButton viewType={tokenViewTypes.outputButton} />
      </div>
    </div>
  );
};

export default SelectedLpToken;
