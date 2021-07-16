import { Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
// the other components
import Sidebar from "../../components/sidebar";
import GenerateLP from "../../components/generate";
import Copyright from "../../components/copyright";
import ConnectWallet from "../../components/connect-wallet";
// Utils
import { tokenViewTypes } from "../../utils";
import { setActiveAction } from "../../redux/dex";
const HomeView = () => {
  const { walletAddress } = useSelector((state) => state.wallet);
  const { activeAction } = useSelector((state) => state.dexes);
  const dispatch = useDispatch();
  if(activeAction !== "Generate") dispatch(setActiveAction({ activeAction: "Generate" }));
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
