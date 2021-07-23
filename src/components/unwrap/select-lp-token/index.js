import "./index.scss";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import pair from "../../../assets/images/pair.svg";
import { LpTokenIconView } from "../../token-selector";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLpTokenPair } from "../../../redux/unwrap";
import Dexes, { MobileDexes } from "../../dex-buttons";

import { constants } from "../../../utils";

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
  return (
    <>
      <div className="main-wrapper-header ">
        <span className="main-header-text">Unwrap LP Tokens</span>
        <span className="unwrap-dex">
          Your <span className="dex-name">{dexName}</span> LP Tokens
          <span className="unwrap-dex-btns">
            <Dexes />
          </span>
        </span>
      </div>
      <div className="main-wrapper-interface">
        <div className="input-token-section">
          <div className="token-label">Select LP Tokens to Unwrap</div>
          <div>
            {lpTokenPairs.map((pair, idx) => (
              <DesktopLpTokens lpPair={pair} idx={idx} />
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
          {lpTokenPairs.map((pair, idx) => (
            <MobileLpTokens lpPair={pair} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DesktopLpTokens = ({ lpPair, idx }) => {
  const dispatch = useDispatch();
  const { lpToken1, lpToken2 } = lpPair;
  const lpPairName = lpToken1.symbol + "/" + lpToken2.symbol;
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  return (
    <Row
      className="unwrap-row"
      onClick={() => {
        dispatch(
          setSelectedLpTokenPair({
            selectedLpTokenPair: idx,
            selectedDex: selectedDex,
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
        <div className="unwrap-pair-dex">4.5324 {dexName} LP Tokens</div>
      </Col>
      <Col className="unwrap-pair-amount">$4,623.42</Col>
    </Row>
  );
};

const MobileLpTokens = ({ lpPair, idx }) => {
  const dispatch = useDispatch();
  const { lpToken1, lpToken2 } = lpPair;
  const lpPairName = lpToken1.symbol + "/" + lpToken2.symbol;
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  return (
    <Row
      className="unwrap-row"
      onClick={() => {
        dispatch(
          setSelectedLpTokenPair({
            selectedLpTokenPair: idx,
            selectedDex: selectedDex,
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
        <div className="unwrap-pair-amount">$4,623.42</div>
      </Col>
      <Col className="unwrap-pair-dex">4.5324 {dexName} LP Tokens</Col>
    </Row>
  );
};
export default SelectLpToken;
