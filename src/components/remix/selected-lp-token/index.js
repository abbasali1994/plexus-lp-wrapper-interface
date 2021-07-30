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
import { formatAmount } from "../../../utils/display";

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
  const { selectedLpTokenPair } = useSelector((state) => state.tokens);
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const { lpToken1, lpToken2, liquidityTokenBalance } = selectedLpTokenPair;
  const lpPairName = lpToken1.symbol + "/" + lpToken2.symbol;

  return (
    <>
      <div className="main-wrapper-header ">
        <span className="main-header-text">
          Remix {lpPairName.toUpperCase()} LP Tokens
        </span>
      </div>
      <div className="main-wrapper-interface">
        <Row className="remix-row">
          <Col className="remix-tokens">
            <LpTokenIconView
              tokenIcon={lpToken1.tokenIcon}
              tokenIconSize={45}
            />
            <img
              className="remix-pair-icon"
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
            <div className="remix-pair-text">{lpPairName}</div>
            <div className="remix-pair-dex">
              {formatAmount(liquidityTokenBalance)} {dexName} LP Tokens
            </div>
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
  const { selectedLpTokenPair } = useSelector((state) => state.tokens);
  const { lpToken1, lpToken2, lpTokenPrice, liquidityTokenBalance } =
    selectedLpTokenPair;
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;

  const lpPairName = lpToken1.symbol + "/" + lpToken2.symbol;

  return (
    <div className="main-wrapper-interface">
      <Row className="remix-row">
        <Col className="remix-tokens">
          <LpTokenIconView tokenIcon={lpToken1.tokenIcon} tokenIconSize={45} />
          <img
            className="remix-pair-icon"
            src={pair}
            width="16"
            height="16"
            alt="pair"
          />
          <LpTokenIconView tokenIcon={lpToken2.tokenIcon} tokenIconSize={45} />
        </Col>
        <Col>
          <div className="remix-pair-text">{lpPairName}</div>
          <div className="remix-pair-amount">
            ${formatAmount(liquidityTokenBalance*lpTokenPrice)}
          </div>
        </Col>
        <Col className="remix-pair-dex">
          {formatAmount(liquidityTokenBalance)} {dexName} LP Tokens
        </Col>
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
