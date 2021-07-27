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
import { displayAmountWithDecimals } from "../../../utils/wallet";

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
      <DesktopDashboardPairs />
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

const DesktopDashboardPairs = () => {
  const { lpTokens } = useSelector((state) => state.wallet);
  const { selectedDex } = useSelector((state) => state.dexes);

  let children = <NothingToSee />;
  if (!lpTokens[selectedDex]) children = <Loading />;
  else if (lpTokens[selectedDex].length > 0)
    children = (
      <div className="dashboard-table">
        <Row className="dashboard-table-header">
          <Col>Tokens</Col>
          <Col>Pair</Col>
          <Col>USD Value</Col>
          <Col lg="4">Actions</Col>
        </Row>
        <div className="dashboard-table-body">
          {lpTokens[selectedDex].map((lpTokenPair, id) => (
            <GeneratingLPTokenDesktopView key={id} lpTokens={lpTokenPair} />
          ))}
        </div>
      </div>
    );

  return <div className="dashboard-wrapper-interface">{children}</div>;
};

const GeneratingLPTokenMobileView = ({ lpTokens }) => {
  const { lpToken1, lpToken2, liquidityTokenBalance, lpTokenPrice } = lpTokens;
  const lpPair = lpToken1.symbol + "/" + lpToken2.symbol;
  const dispatch = useDispatch();
  const handleRemixClick = () => {
    dispatch(resetState())
    dispatch(setSelectedLpTokenPair({ selectedLpTokenPair: lpTokens }));
    navigate("/remix");
  };

  const handleUnwrapClick = () => {
    dispatch(resetState())
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
              {displayAmountWithDecimals(liquidityTokenBalance)} LP Tokens
            </div>
            <div className="dashboard-pair-amount">
              ${displayAmountWithDecimals(liquidityTokenBalance * lpTokenPrice)}
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

const GeneratingLPTokenDesktopView = ({ lpTokens }) => {
  const { lpToken1, lpToken2, liquidityTokenBalance, lpTokenPrice } = lpTokens;
  const lpPair = lpToken1.symbol + "/" + lpToken2.symbol;
  const dispatch = useDispatch();
  const handleRemixClick = () => {
    dispatch(resetState())
    dispatch(setSelectedLpTokenPair({ selectedLpTokenPair: lpTokens }));
    navigate("/remix");
  };

  const handleUnwrapClick = () => {
    dispatch(resetState())
    dispatch(setSelectedLpTokenPair({ selectedLpTokenPair: lpTokens }));
    navigate("/unwrap");
  };
  return (
    <Row className="dashboard-table-row">
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
          {displayAmountWithDecimals(liquidityTokenBalance)} LP Tokens
        </div>
      </Col>
      <Col>
        <div className="dashboard-table-pair-amount">
          ${displayAmountWithDecimals(liquidityTokenBalance * lpTokenPrice)}
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
