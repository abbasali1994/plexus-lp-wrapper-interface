import "./index.scss";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import pair from "../../../assets/images/pair.svg";
import { LpTokenIconView } from "../../token-selector";
import { useSelector } from "react-redux";
import { constants, tokenViewTypes } from "../../../utils";
import TokenSelector from "../../token-selector";
import TransactionButton from "../../transaction-button";
import { RemixDexes } from "../../dex-buttons";

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
  const { selectedLpTokenPair, lpTokenPairs } = useSelector(
    (state) => state.unwrap
  );
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const { lpToken1, lpToken2 } = lpTokenPairs[selectedDex][selectedLpTokenPair];
  const lpPairName = lpToken1.tokenSymbol + "/" + lpToken2.tokenSymbol;

  return (
    <>
      <div className="main-wrapper-header ">
        <span className="main-header-text">
          Remix {lpPairName.toUpperCase()} LP Tokens
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
        <div className="remix-select-dex">
          <div className="remix-select-dex-header">Select Dex</div>
          <RemixDexes />
        </div>
        <div className="remix-select-tokens">
          <TokenSelector viewType={tokenViewTypes.remixToken} />
        </div>
        <div className="input-btn">
          <TransactionButton viewType={tokenViewTypes.remixButton} />
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
  const lpPairName = lpToken1.tokenSymbol + "/" + lpToken2.tokenSymbol;

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

      <div className="remix-select-dex-header">Select Dex</div>
      <RemixDexes />

      <TokenSelector viewType={tokenViewTypes.remixToken} />

      <div className="input-btn">
        <TransactionButton viewType={tokenViewTypes.remixButton} />
      </div>
    </div>
  );
};

export default SelectedLpToken;