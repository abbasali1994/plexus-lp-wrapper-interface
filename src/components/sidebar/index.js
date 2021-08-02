import "./index.scss";
import { Col, ButtonGroup, Button, Row } from "react-bootstrap";
import { useState, useEffect } from "react";

// import the images
import action from "../../assets/images/action.svg";
import dex from "../../assets/images/dex.svg";
import faq from "../../assets/images/faq.svg";
import pair from "../../assets/images/dashboard-pair.svg";
import token from "../../assets/images/dashboard-token.svg";
import history from "../../assets/images/dashboard-history.svg";
import upArrow from "../../assets/icons/u-arrow.svg";
import downArrow from "../../assets/icons/d-arrow.svg";
import spinner from "../../assets/gifs/confirmation.gif";
// constants
import { constants, tokenViewTypes } from "../../utils";

// Dex Buttons
import Dexes from "../dex-buttons";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Routing
import { navigate } from "hookrouter";
import { usePath } from "hookrouter";

import { setActiveAction } from "../../redux/dex";
import { resetState } from "../../redux/tokens";
import { resetTxnState } from "../../redux/transactions";
import { fetchUniswapStat, fetchUniswapTokensCount } from "../../gql/uniswap";
import { formatAmount } from "../../utils/display";
import { fetchSushiStat, fetchSushiTokensCount } from "../../gql/sushiswap";

const dexStats = [
  {
    key: "totalLiquidityUSD",
    dexStatKey: "Protocol Liquidity",
    dexStatValue: "$4.241b",
  },
  {
    key: "pairCount",
    dexStatKey: "Number of Pairs",
    dexStatValue: "942",
  },
  {
    key: "tokensCount",
    dexStatKey: "Number of Tokens",
    dexStatValue: "736",
  },
];

const DashboardSideBarComponent = () => {
  const pathName = usePath();
  const [activeDashboardPath] = useState(pathName);
  const paths = [
    { icon: pair, name: "/dashboard/pairs", id: "pairs" },
    { icon: token, name: "/dashboard/tokens", id: "tokens" },
    { icon: history, name: "/dashboard/history", id: "history" },
  ];
  return (
    <Col lg="1" className="dashboard-sidebar">
      <div className="dashboard-icons">
        {paths.map((path) => (
          <div
            key={path.name}
            className="dashboard-icon"
            id={path.name === activeDashboardPath ? "active-path" : ""}
            onClick={() => {
              navigate(path.name);
            }}
          >
            <div className="dashboard-icon-background">
              <img
                src={path.icon}
                width="22"
                height="22"
                alt={`${path.id} icon`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="faq1">
        <img
          className="float-left"
          src={faq}
          alt="logo"
          width="25"
          height="25"
        />
        FAQ
      </div>
    </Col>
  );
};

//Desktop Wrapper (min-width : 1024 px)
const DesktopSideBarWrapper = ({
  dexes,
  selectedDex,
  dexName,
  activeAction,
}) => {
  const bg =
    dexName === constants.dexSushi ? "left-sidebar-sushi" : "left-sidebar-uni";
  return (
    <Col lg="3" className={bg}>
      <div className="left-sidebar-wrapper">
        <SideBarContent
          toggleSideMenu={true}
          dexes={dexes}
          selectedDex={selectedDex}
          activeAction={activeAction}
        />
      </div>
    </Col>
  );
};

//Mobile Wrapper (max-width : 1024 px)
const MobileSideBarWrapper = ({
  dexes,
  selectedDex,
  dexName,
  activeAction,
}) => {
  const [toggleSideMenu, setToggleSideMenu] = useState(false);
  const [toggleButtonImg, settoggleButtonImg] = useState(upArrow);

  const bg =
    dexName === constants.dexSushi ? "left-sidebar-sushi" : "left-sidebar-uni";

  const showSideMenu = (value) => {
    setToggleSideMenu(value);

    value ? settoggleButtonImg(downArrow) : settoggleButtonImg(upArrow);
  };

  return (
    <div className="bottom-sidebar-wrapper">
      <div className="bottom-header">
        <div className="display-header-text">
          {activeAction}{" "}
          <span className="text-theme">&nbsp;LP Tokens for&nbsp;</span>
          {dexes[selectedDex].name}
        </div>
        <div className="display-header-button">
          <img
            className="float-right"
            src={toggleButtonImg}
            alt="logo"
            width="21"
            height="30"
            onClick={() => showSideMenu(!toggleSideMenu)}
          />
        </div>
      </div>
      {toggleSideMenu && (
        <div className={bg}>
          <SideBarContent
            activeAction={activeAction}
            dexes={dexes}
            selectedDex={selectedDex}
            showSideMenu={showSideMenu}
          />
        </div>
      )}
    </div>
  );
};

//Internal Sidebar Content
const SideBarContent = ({ dexes, selectedDex, showSideMenu, activeAction }) => {
  const actionButtons = ["Generate", "Unwrap", "Remix"];
  const [lpGenerateBtn, setLpGenerateBtn] = useState(
    "SELECT LP TOKEN TO GENERATE"
  );
  const [liquidityStats, setLiquidityStats] = useState({});
  const { showConfirm } = useSelector((state) => state.transactions);
  const dispatch = useDispatch();

  useEffect(() => {
    showConfirm
      ? setLpGenerateBtn("START OVER")
      : setLpGenerateBtn("SELECT LP TOKEN TO GENERATE");
  }, [showConfirm]);

  useEffect(() => {
    setLiquidityStats({});
    async function getStats() {
      let stats = {};
      let liquidityStats = {};
      let tokensCount = 0;
      if (selectedDex === 0) {
        stats = await fetchSushiStat();
        tokensCount = await fetchSushiTokensCount();
        liquidityStats = {
          tokensCount: formatAmount(tokensCount),
          pairCount: formatAmount(stats.pairCount),
          totalLiquidityUSD: `$${formatAmount(stats.liquidityUSD)}`,
        };
      } else {
        stats = await fetchUniswapStat();
        tokensCount = await fetchUniswapTokensCount();
        liquidityStats = {
          tokensCount: formatAmount(tokensCount),
          pairCount: formatAmount(stats.pairCount),
          totalLiquidityUSD: `$${formatAmount(stats.totalLiquidityUSD)}`,
        };
      }
      setLiquidityStats(liquidityStats);
    }
    getStats();
  }, [selectedDex]);
  return (
    <>
      <div className="left-action main-header-text">
        ACTION
        <img
          className="float-right"
          src={action}
          alt="logo"
          width="17"
          height="17"
        />
      </div>
      <div>
        <ButtonGroup className="mb-2 action-btns">
          {actionButtons.map((btn) => (
            <Button
              key={btn}
              id={btn === activeAction ? "active-btn" : ""}
              onClick={() => {
                dispatch(setActiveAction({ activeAction: btn }));
                dispatch(resetState());
                dispatch(resetTxnState());
                switch (btn) {
                  case "Unwrap":
                    navigate("/unwrap");
                    break;
                  case "Remix":
                    navigate("/remix");
                    break;
                  default:
                    navigate("/");
                }
              }}
            >
              {btn}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <Row
        className="dex-buttons"
        style={activeAction !== "Generate" ? { visibility: "hidden" } : {}}
      >
        <div className="dex-text left-action main-header-text">
          DEX
          <img
            className="dex-img float-right"
            src={dex}
            alt="logo"
            width="17"
            height="17"
          />
        </div>
        {/* The dex buttons */}
        <Dexes />
      </Row>
      <Row>
        <Col>
          <Button
            className="select-lp-generate"
            style={activeAction !== "Generate" ? { visibility: "hidden" } : {}}
            onClick={() => {
              // clear the global state
              showSideMenu(false);
              dispatch(resetState());
              dispatch(resetTxnState());
              navigate("/");
            }}
          >
            {lpGenerateBtn}
          </Button>
        </Col>
      </Row>
      <div className="dex-stats">
        <div className="dex-stats-header">{dexes[selectedDex].name} stats</div>
        {dexStats.map((dex) => (
          <span key={dex.dexStatKey}>
            <div className="dex-stats-key">{dex.dexStatKey}</div>
            <div className="dex-stats-value">
              {liquidityStats[dex.key] || (
                <img
                  className="token-icon"
                  src={spinner}
                  alt={"loading"}
                  width="30"
                  height="30"
                />
              )}
            </div>
          </span>
        ))}
      </div>
      <div className="faq">
        <img
          className="float-left"
          src={faq}
          alt="logo"
          width="25"
          height="25"
        />
        FAQ
      </div>
    </>
  );
};

const SideBarComponent = ({ viewType }) => {
  let element = null;
  const [width, setWidth] = useState(window.innerWidth);
  const { dexes, selectedDex, activeAction } = useSelector(
    (state) => state.dexes
  );
  const dexName = dexes[selectedDex].name;
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });

  let props = {
    dexes,
    selectedDex,
    dexName,
    activeAction,
  };
  if (viewType === tokenViewTypes.dashboardInterface) {
    element = <DashboardSideBarComponent />;
  }

  if (viewType === tokenViewTypes.mainInterface) {
    element =
      width > constants.width.mobile ? (
        <DesktopSideBarWrapper {...props} />
      ) : (
        <MobileSideBarWrapper {...props} />
      );
  }

  return element;
};

export default SideBarComponent;
