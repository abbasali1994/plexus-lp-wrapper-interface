import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";
// the other components
import Sidebar from "../../components/sidebar";
import GenerateLP from "../../components/generate";
import Copyright from "../../components/copyright";
import ConnectWallet from "../../components/connect-wallet";
// Utils
import { tokenViewTypes } from "../../utils";

const HomeView = () => {
  const { walletAddress } = useSelector((state) => state.wallet);
  return (
    <div className="main-section">
      <Row>
        <Sidebar viewType={tokenViewTypes.mainInterface} />
        {walletAddress ? <GenerateLP /> : <ConnectWallet />}
      </Row>
      <Copyright />
    </div>
  );
};

export default HomeView;
