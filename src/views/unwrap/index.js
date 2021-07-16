import { Row } from "react-bootstrap";

// the other components
import Sidebar from "../../components/sidebar";
import UnwrapLP from "../../components/unwrap";
import Copyright from "../../components/copyright";

// Utils
import { tokenViewTypes } from "../../utils";
import { useSelector,useDispatch } from "react-redux";
import ConnectWallet from "../../components/connect-wallet";
import { setActiveAction } from "../../redux/dex";

const UnwrapView = () => {
  const { walletAddress } = useSelector((state) => state.wallet);
  const { activeAction } = useSelector((state) => state.dexes);
  const dispatch = useDispatch();
  if(activeAction !== "Unwrap") dispatch(setActiveAction({ activeAction: "Unwrap" }));
  return (
    <div className="main-section">
      <Row>
        <Sidebar viewType={tokenViewTypes.mainInterface} />
        {walletAddress ? <UnwrapLP /> : <ConnectWallet />}
      </Row>
      <Copyright />
    </div>
  );
};

export default UnwrapView;
