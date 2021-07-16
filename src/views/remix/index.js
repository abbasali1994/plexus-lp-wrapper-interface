import { Row } from "react-bootstrap";

// the other components
import Sidebar from "../../components/sidebar";
import RemixLP from "../../components/remix";
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
  if(activeAction !== "Remix") dispatch(setActiveAction({ activeAction: "Remix" }));
  return (
    <div className="main-section">
      <Row>
        <Sidebar viewType={tokenViewTypes.mainInterface} />
        {walletAddress ? <RemixLP /> : <ConnectWallet />}
      </Row>
      <Copyright />
    </div>
  );
};

export default UnwrapView;
