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
import { getTokenUSDPrices } from '../../redux/prices';
import { getCoinGeckoTokenIDS } from "../../utils/token";
// import { setWalletUSDValue } from "../../redux/wallet";

const Header = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenIds = getCoinGeckoTokenIDS();

    dispatch(getTokenUSDPrices(tokenIds))
  },[dispatch])


  const { walletAddress } = useSelector((state) => state.wallet);
  // const { status, pricesUSD } = useSelector((state) => state.prices);
  const [toggleIcon, setToggleIcon] = useState(false);

  // const tokenDetails = getCoinGeckoTokenIDAndTokenSymbol();

  // we set the USD values for each token we currently support
  // if(status ==="success") {
  //   Object.keys(pricesUSD).forEach((key) => {
  //     dispatch(setWalletUSDValue({ key: tokenDetails[key], usdValue: pricesUSD[key].usd }))
  //   });
  // }

  return (
    <Row className="header">
      <Col>
        <img
          className="logo"
          src={logo}
          alt="logo"
          width="170"
          height="32"
          onClick={() => navigate("/")}
        />
      </Col>
      <Col lg={6} xs={12}>
        <div className="user-info">
          {walletAddress ? <NotificationButton /> : null}
          {walletAddress ? (
            <button className="header-btn">
              {" "}
              {formatAddress(walletAddress)}
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
    if (txnStatus && pathName !== "/"+txnStatus) navigate("/" + txnStatus);
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
      {txnStatus && pathName !== "/"+txnStatus && (
        <Badge>
          <div className={"circle"} />
        </Badge>
      )}
    </>
  );
};

export default Header;
