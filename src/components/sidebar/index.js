import "./index.css";
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

// constants
import { constants, tokenViewTypes } from "../../utils";

// Dex Buttons
import Dexes from "../dex-buttons";

// Redux
import { useSelector } from "react-redux";

// Routing
import { navigate } from "hookrouter";
import { usePath } from "hookrouter";

const dexStats = [
  {
    dexStatKey: "Protocol Liquidity",
    dexStatValue: "$4.241b",
  },
  {
    dexStatKey: "Number of Pairs",
    dexStatValue: "942",
  },
  {
    dexStatKey: "Number of Tokens",
    dexStatValue: "736",
  },
];

const DashboardSideBarComponent = () => {
  const pathName = usePath();
  const [activeDashboardPath] = useState(pathName);
  const paths = [
    { icon: pair, name: "/dashboard/pairs" },
    { icon: token, name: "/dashboard/tokens" },
    { icon: history, name: "/dashboard/history" },
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
              <img src={path.icon} width="22" height="22" alt="pair icon" />
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
const DesktopSideBarWrapper = ({ dexes, selectedDex, dexName }) => {
  const bg =
    dexName === constants.dexSushi ? "left-sidebar-sushi" : "left-sidebar-uni";
  return (
    <Col lg="3" className={bg}>
      <div className="left-sidebar-wrapper">
        <SideBarContent
          toggleSideMenu={true}
          dexes={dexes}
          selectedDex={selectedDex}
        />
      </div>
    </Col>
  );
};

//Mobile Wrapper (max-width : 1024 px)
const MobileSideBarWrapper = ({ dexes, selectedDex, dexName }) => {
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
          Generate <span className="text-white">&nbsp;LP Tokens for&nbsp;</span>
          SushiSwap
        </div>
        <div className="display-header-button"><img
            className="float-right"
            src={toggleButtonImg}
            alt="logo"
            width="21"
            height="30"
            onClick={() => showSideMenu(!toggleSideMenu)}
          /></div>
      </div>
      {toggleSideMenu && (
        <div className={bg}>
          <SideBarContent dexes={dexes} selectedDex={selectedDex} />
        </div>
      )}
    </div>
  );
};

//Internal Sidebar Content
const SideBarContent = ({ dexes, selectedDex }) => {
  const actionButtons = ["Generate", "Unwrap", "Remix"];

  const [activeActionBtn, setActiveActionBtn] = useState("Generate");
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
              id={btn === activeActionBtn ? "active-btn" : ""}
              onClick={() => setActiveActionBtn(btn)}
            >
              {btn}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <Row className="dex-buttons">
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
      <Button className="select-lp-generate btn btn-primary" style={activeActionBtn !== "Generate"?{visibility:"hidden"}:{}}>SELECT LP TOKEN TO GENERATE</Button>
      <div className="dex-stats">
        <div className="dex-stats-header">{dexes[selectedDex].name} stats</div>
        {dexStats.map((dex) => (
          <span key={dex.dexStatKey}>
            <div className="dex-stats-key">{dex.dexStatKey}</div>
            <div className="dex-stats-value">{dex.dexStatValue}</div>
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
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });

  let props = { dexes, selectedDex, dexName };
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