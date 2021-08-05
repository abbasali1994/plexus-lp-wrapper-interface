import "./index.scss";
import { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import pair from "../../../assets/images/pair.svg";
import { LpTokenIconView } from "../../token-selector";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLpTokenPair } from "../../../redux/tokens";
import Dexes, { MobileDexes } from "../../dex-buttons";

import { constants } from "../../../utils";
import { formatAmount, isInViewport } from "../../../utils/display";

const SelectLpToken = (props) => {
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

const DesktopWrapper = ({ lpTokenPairs }) => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const divRef = useRef(null);
  const [cursor, setCursor] = useState(-1);
  function handleKeyDown(e) {
    const box = document.getElementsByClassName("input-token-section")[0];
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      const token = document.getElementById("unwrap-row-" + (cursor - 1));
      setCursor(cursor - 1);
      if (!isInViewport(token, box)) token.scrollIntoView();
    } else if (e.keyCode === 40 && cursor < lpTokenPairs.length - 1) {
      const token = document.getElementById("unwrap-row-" + (cursor + 1));
      setCursor(cursor + 1);
      if (!isInViewport(token, box)) token.scrollIntoView();
    } else if (e.key === "Enter" && cursor > -1) {
      const token = document.getElementById("unwrap-row-" + cursor);
      token.click();
    }
  }
  useEffect(() => {
    divRef.current.focus();
  });
  return (
    <>
      <div className="main-wrapper-header">
        <span className="main-header-text">Unwrap LP Tokens</span>
        <span className="unwrap-dex">
          Your <span className="dex-name">{dexName}</span> LP Tokens
          <span className="unwrap-dex-btns">
            <Dexes />
          </span>
        </span>
      </div>
      <div
        className="main-wrapper-interface"
        ref={divRef}
        onKeyDown={handleKeyDown}
        tabIndex="0"
      >
        <div className="input-token-section">
          <div className="token-label">Select LP Tokens to Unwrap</div>
          <div className="home-table-body">
            {lpTokenPairs &&
              lpTokenPairs.map((pair, idx) => (
                <DesktopLpTokens
                  lpPair={pair}
                  idx={idx}
                  key={idx}
                  tokenSelected={cursor === idx ? "unwrap-row-selected" : ""}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

const MobileWrapper = ({ lpTokenPairs }) => {
  return (
    <div className="main-wrapper-interface">
      <div className="input-token-section">
        <div className="token-label">Select LP Tokens to Unwrap</div>
        <MobileDexes />
        <div>
          {lpTokenPairs &&
            lpTokenPairs.map((pair, idx) => (
              <MobileLpTokens lpPair={pair} idx={idx} key={idx} />
            ))}
        </div>
      </div>
    </div>
  );
};

const DesktopLpTokens = ({ lpPair, idx, tokenSelected }) => {
  const dispatch = useDispatch();
  const { lpToken1, lpToken2, lpTokenPrice, liquidityTokenBalance } = lpPair;
  const lpPairName = lpToken1.symbol + "/" + lpToken2.symbol;
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  return (
    <Row
      id={"unwrap-row-" + idx}
      className={"unwrap-row " + tokenSelected}
      onClick={() => {
        dispatch(
          setSelectedLpTokenPair({
            selectedLpTokenPair: lpPair,
          })
        );
      }}
    >
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
        <div className="unwrap-pair-dex">
          {formatAmount(liquidityTokenBalance)} {dexName} LP Tokens
        </div>
      </Col>
      <Col className="unwrap-pair-amount">
        ${formatAmount(liquidityTokenBalance * lpTokenPrice)}
      </Col>
    </Row>
  );
};

const MobileLpTokens = ({ lpPair, idx }) => {
  const dispatch = useDispatch();
  const { lpToken1, lpToken2, lpTokenPrice, liquidityTokenBalance } = lpPair;
  const lpPairName = lpToken1.symbol + "/" + lpToken2.symbol;
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  return (
    <Row
      className="unwrap-row"
      onClick={() => {
        dispatch(
          setSelectedLpTokenPair({
            selectedLpTokenPair: lpPair,
          })
        );
      }}
    >
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
        <div className="unwrap-pair-amount">
          ${formatAmount(liquidityTokenBalance * lpTokenPrice)}
        </div>
      </Col>
      <Col className="unwrap-pair-dex">
        {formatAmount(liquidityTokenBalance)} {dexName} LP Tokens
      </Col>
    </Row>
  );
};
export default SelectLpToken;
