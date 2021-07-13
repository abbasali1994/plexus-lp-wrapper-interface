import "./index.scss";
import { Row, Col } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";

import { setWalletAddress } from "../../redux/wallet";
import wallet from "../../assets/images/wallet.svg";
import { connectToWallet } from "../../utils/wallet";

const ConnectWallet = () => {
  const { activeAction, dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const dispatch = useDispatch();

  const handleConnectWalletClick = async() => {
    
    const web3 = await connectToWallet();
    const accounts = await web3.eth.getAccounts();
    const walletAddress = accounts[0];

    dispatch(
      setWalletAddress({
        walletAddress,
      })
    );
  };
  return (
    <Col lg="9" className="main-wrapper">
      <div className="main-wrapper-header main-header-text">
        {activeAction} {dexName} LP Tokens
      </div>
      <div className="main-wrapper-interface">
        <Row className="connect-wallet">
          <Col lg={6}>
            <img src={wallet} alt="wallet-icon" />
            <div className="connect-wallet-text">
              PLEASE CONNECT A WALLET TO CONTINUE
            </div>
            <button
              className="btn btn-primary connect-wallet-btn"
              onClick={() => handleConnectWalletClick()}
            >
              Connect wallet
            </button>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default ConnectWallet;
