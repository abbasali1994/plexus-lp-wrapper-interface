import "./index.scss";
import { Col, Row } from "react-bootstrap";
import { useState } from "react";

// import the images
import pair from "../../../assets/images/dashboard-pair.svg";
import token from "../../../assets/images/dashboard-token.svg";
import history from "../../../assets/images/dashboard-history.svg";

// Routing
import { navigate } from "hookrouter";
import { usePath } from "hookrouter";

const DashboardMainComponent = () => {
  const pathName = usePath();
  const [activeDashboardPath] = useState(pathName);
  const paths = [
    {
      id:"pairs",
      icon: pair,
      name: "/dashboard/pairs",
      content:
        "View your SushiSwap and Uniswap LP Tokens, and Unwrap or Remix them",
    },
    {
      id:"tokens",
      icon: token,
      name: "/dashboard/tokens",
      content:
        "View the tokens in your wallet, and generate SushiSwap or Uniswap LP tokens from them",
    },
    {
      id:"history",
      icon: history,
      name: "/dashboard/history",
      content: "View your transaction history on Plexus",
    },
  ];
  return (
    <div className="main-wrapper-interface">
      <div className="dashboard-icons">
        {paths.map((path) => (
          <div key={path.name}>
            <span className="main-dashboard-path-name">
              {path.name.replace("/dashboard/", "")}
            </span>
            <Row>
              <div
                className="main-dashboard-icon"
                id={path.name === activeDashboardPath ? "active-path" : ""}
                onClick={() => {
                  navigate(path.name);
                }}
              >
                <div className="dashboard-icon-background">
                  <img src={path.icon} width="22" height="22" alt={`${path.id} icon`} />
                </div>
              </div>
              <Col className="main-dashboard-contents">{path.content}</Col>
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMainComponent;
