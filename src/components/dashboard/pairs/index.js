import "./index.scss";
import { useState, useEffect } from "react";
// React Bootstrap
import { Col, Row } from "react-bootstrap";

// Dashboard Header
import { LpTokenIconView } from "../../token-selector";
import pair from "../../../assets/images/pair.svg";
import { constants } from "../../../utils";
import { MobileDexes } from "../../dex-buttons";
import { useSelector, useDispatch } from "react-redux";
import NothingToSee from "../../nothing-to-see";
import Loading from "../../loading";
import { resetState, setSelectedLpTokenPair } from "../../../redux/tokens";
import { navigate } from "hookrouter";
import {
  formatAmount,
} from "../../../utils/display";

const DashboardPairsComponent = () => {
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
      <DesktopPairsWrapper />
    ) : (
      <MobileDashboardPairs />
    );

  return element;
};

const MobileDashboardPairs = () => {
  const { lpTokens } = useSelector((state) => state.wallet);
  const { selectedDex } = useSelector((state) => state.dexes);

  let children = <NothingToSee />;
  if (!lpTokens[selectedDex]) children = <Loading />;
  else if (lpTokens[selectedDex].length > 0)
    children = lpTokens[selectedDex].map((lpTokenPair, id) => (
      <GeneratingLPTokenMobileView lpTokens={lpTokenPair} key={id} />
    ));
  return (
    <div className="main-wrapper-interface">
      <MobileDexes />
      {children}
    </div>
  );
};

const DesktopPairsWrapper = () => {
  const { lpTokens } = useSelector((state) => state.wallet);
  const { selectedDex } = useSelector((state) => state.dexes);
  let children = <NothingToSee />;
  if (!lpTokens[selectedDex]) children = <Loading />;
  else if (lpTokens[selectedDex].length > 0)
    children = <DesktopDashboardPairs lpTokens={lpTokens[selectedDex]} />;

  return <div className="dashboard-wrapper-interface">{children}</div>;
};

const DesktopDashboardPairs = ({ lpTokens }) => {
  // const divRef = useRef(null);
  // const [cursor, setCursor] = useState(-1);
  // function handleKeyDown(e) {
  //   const box = document.getElementsByClassName("dashboard-table-body")[0];
  //   // arrow up/down button should select next/previous list element
  //   if (e.keyCode === 38 && cursor > 0) {
  //     const token = document.getElementById("dashboard-pairs-" + (cursor - 1));
  //     setCursor(cursor - 1);
  //     if (!isInViewport(token, box)) token.scrollIntoView();
  //   } else if (e.keyCode === 40 && cursor < lpTokens.length - 1) {
  //     const token = document.getElementById("dashboard-pairs-" + (cursor + 1));
  //     setCursor(cursor + 1);
  //     if (!isInViewport(token, box)) token.scrollIntoView();
  //   } else if (e.key === "Enter" && cursor > -1) {
  //   }
  // }

  // useEffect(() => {
  //   divRef.current.focus();
  // });

  return (
    <div
      className="dashboard-wrapper-interface"
      // ref={divRef}
      // tabIndex="0"
      // onKeyDown={handleKeyDown}
    >
      <div className="dashboard-table">
        <Row className="dashboard-table-header">
          <Col>Tokens</Col>
          <Col>Pair</Col>
          <Col>USD Value</Col>
          <Col lg="4">Actions</Col>
        </Row>
        <div className="dashboard-table-body">
          {lpTokens.map((lpTokenPair, id) => (
            <GeneratingLPTokenDesktopView
              key={id}
              lpTokens={lpTokenPair}
              tokenID={"dashboard-pairs-" + id}
              // tokenSelected={cursor === id ? "token-selected" : ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const GeneratingLPTokenMobileView = ({ lpTokens }) => {
  const { lpToken1, lpToken2, liquidityTokenBalance, lpTokenPrice } = lpTokens;
  const lpPair = lpToken1.symbol + "/" + lpToken2.symbol;
  const dispatch = useDispatch();
  const handleRemixClick = () => {
    dispatch(resetState());
    dispatch(setSelectedLpTokenPair({ selectedLpTokenPair: lpTokens }));
    navigate("/remix");
  };

  const handleUnwrapClick = () => {
    dispatch(resetState());
    dispatch(setSelectedLpTokenPair({ selectedLpTokenPair: lpTokens }));
    navigate("/unwrap");
  };
  return (
    <div className="dashboard-pair">
      <div className="dashboard-lp-view">
        <div className="select-token">
          <LpTokenIconView tokenIcon={lpToken1.tokenIcon} tokenIconSize={51} />
        </div>
        <img
          className="dashboard-pair-icon"
          src={pair}
          width="16"
          height="46"
          alt="pair"
        />
        <div className="select-token">
          <LpTokenIconView tokenIcon={lpToken2.tokenIcon} tokenIconSize={51} />
        </div>
        <div className="lp-pair-info">
          <div className="dashboard-pair-text">{lpPair}</div>
          <div className="lp-pair-desc">
            <div className="dashboard-pair-dex">
              {formatAmount(liquidityTokenBalance)} LP Tokens
            </div>
            <div className="dashboard-pair-amount">
              ${formatAmount(liquidityTokenBalance * lpTokenPrice)}
            </div>
          </div>
        </div>
      </div>
      <Row>
        <Col>
          <button
            className="dashboard-pair-btn"
            onClick={() => handleUnwrapClick()}
          >
            Unwrap
          </button>
        </Col>
        <Col>
          <button
            className="dashboard-pair-btn"
            onClick={() => handleRemixClick()}
          >
            Remix
          </button>
        </Col>
      </Row>
    </div>
  );
};

const GeneratingLPTokenDesktopView = ({ lpTokens, tokenID, tokenSelected }) => {
  const { lpToken1, lpToken2, liquidityTokenBalance, lpTokenPrice } = lpTokens;
  const lpPair = lpToken1.symbol + "/" + lpToken2.symbol;
  const dispatch = useDispatch();
  const handleRemixClick = () => {
    dispatch(resetState());
    dispatch(setSelectedLpTokenPair({ selectedLpTokenPair: lpTokens }));
    navigate("/remix");
  };

  const handleUnwrapClick = () => {
    dispatch(resetState());
    dispatch(setSelectedLpTokenPair({ selectedLpTokenPair: lpTokens }));
    navigate("/unwrap");
  };
  return (
    <Row id={tokenID} className={`dashboard-table-row ${tokenSelected}`}>
      <Col className="dashboard-table-tokens">
        <LpTokenIconView tokenIcon={lpToken1.tokenIcon} tokenIconSize={45} />
        <img
          className="dashboard-table-pair-icon"
          src={pair}
          width="16"
          height="16"
          alt="pair"
        />
        <LpTokenIconView tokenIcon={lpToken2.tokenIcon} tokenIconSize={45} />
      </Col>
      <Col>
        <div className="dashboard-table-pair-text">{lpPair}</div>
        <div className="dashboard-table-pair-dex">
          {formatAmount(liquidityTokenBalance)} LP Tokens
        </div>
      </Col>
      <Col>
        <div className="dashboard-table-pair-amount">
          ${formatAmount(liquidityTokenBalance * lpTokenPrice)}
        </div>
      </Col>
      <Col lg="4">
        <Row>
          <Col>
            <button
              className="dashboard-pair-btn"
              onClick={() => handleUnwrapClick()}
            >
              Unwrap
            </button>
          </Col>
          <Col>
            <button
              className="dashboard-pair-btn"
              onClick={() => handleRemixClick()}
            >
              Remix
            </button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default DashboardPairsComponent;
