import "./index.scss";
import { Row, Col, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";

// get the images
import logo from "../../assets/images/logo.png";
import msg from "../../assets/images/message.svg";
import profileBlue from "../../assets/images/profile-blue.svg";
import profileWhite from "../../assets/images/profile-white.svg";

// utils
import { formatAddress } from "../../utils";

// navigate
import { navigate } from "hookrouter";
import { useSelector, useDispatch } from "react-redux";
import { usePath } from "hookrouter";

// token usd prices
import { getTokenUSDPrices, getGasPrices } from "../../redux/prices";
import { getCoinGeckoTokenIDS } from "../../utils/token";
import { resetState } from "../../redux/tokens";
import { resetErrors } from "../../redux/errors";

const Header = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenIds = getCoinGeckoTokenIDS();

    dispatch(getTokenUSDPrices(tokenIds));
    dispatch(getGasPrices());
  }, [dispatch]);

  const { walletAddress, ensName } = useSelector((state) => state.wallet);
  const { queryErrors, tradeError, networkError } = useSelector((state) => state.errors);
  const [toggleIcon, setToggleIcon] = useState(false);

  return (
    <Row className="header">
      <Col>
        <img
          className="logo"
          src={logo}
          alt="logo"
          width="170"
          height="32"
          onClick={() => {
            dispatch(resetState());
            dispatch(resetErrors());
            navigate("/");
          }}
        />
      </Col>
      <Col lg={8} xs={12}>
        <b className="errors">
          {queryErrors.uniswap || queryErrors.sushiswap
            ? "Error: Internet connection disabled or unstable"
            : ""}
          {tradeError ?? ""}
          {networkError ?? ""}
        </b>
        <div className="user-info">
          {walletAddress ? <NotificationButton /> : null}
          {walletAddress ? (
            <button
              className="header-btn"
              onClick={() =>
                window.open(
                  `https://etherscan.io/address/${walletAddress}`,
                  "_blank"
                )
              }
            >
              {ensName ? ensName : formatAddress(walletAddress)}
            </button>
          ) : null}
          {walletAddress ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="header-btn"
              onMouseEnter={() => setToggleIcon(true)}
              onMouseLeave={() => setToggleIcon(false)}
            >
              <img
                src={toggleIcon ? profileWhite : profileBlue}
                alt="profile-icon"
                width="13"
                height="13"
              />
              dashboard
            </button>
          ) : null}
        </div>
      </Col>
    </Row>
  );
};

const NotificationButton = () => {
  const { txnStatus } = useSelector((state) => state.transactions);
  const pathName = usePath();
  const handleClick = () => {
    if (txnStatus && pathName !== "/" + txnStatus) navigate("/" + txnStatus);
  };
  return (
    <>
      <img
        src={msg}
        alt="notification"
        width="28"
        height="28"
        onClick={() => handleClick()}
      />
      {txnStatus && pathName !== "/" + txnStatus && (
        <Badge>
          <div className={"circle"} />
        </Badge>
      )}
    </>
  );
};

export default Header;
