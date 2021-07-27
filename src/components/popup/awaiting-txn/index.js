import "./index.scss";

// bootstrap
import { Modal } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import { showAwaitingTxnModal } from "../../../redux/transactions";

// images
import spinner from "../../../assets/gifs/confirmation.gif";

// navigate
import { navigate } from "hookrouter";

const AwaitingTxnsWrapper = (props) => {
  const { showAwaitingTxn } = useSelector((state) => state.transactions);
  if (showAwaitingTxn) return <AwaitingTxnsModal {...props}/>;
    else return "";
}

const AwaitingTxnsModal = ({ theme }) => {
  const { activeAction } = useSelector((state) => state.dexes);
  let content = "";
  switch (activeAction) {
    case "Unwrap":
      content = <UnwrapAwaitingTxnsWrapper />;
      break;
    case "Remix":
      content = <RemixAwaitingTxnsWrapper />;
      break;
    default:
      content = <GenerateAwaitingTxnsWrapper />;
  }
  return (
    <Modal
      show={true}
      backdrop="static"
      keyboard={false}
      animation={true}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={`${theme} awaiting-txn`}
    >
      <Modal.Header closeButton className="awaiting-txn-header">
        <Modal.Title>{}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="awaiting-txn-body">
          <div className="awaiting-txn-text">
            Awaiting
            <br />
            Confirmation
          </div>
          <img
            className="spinner"
            src={spinner}
            alt="spinner"
            width="144"
            height="144"
          />
          {content}
          <div className="awaiting-txn-confirm">
            Confirm this transaction in your wallet
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const GenerateAwaitingTxnsWrapper = () => {
  const { showAwaitingTxn } = useSelector((state) => state.transactions);
  const { lpToken1, lpToken2,  } = useSelector(
    (state) => state.tokens
  );
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  let txnDescLine1 = "";
  let txnDescLine2 = "";

  // if none of the LP Tokens is selected and the modal is supposed to be visible, then simulate a blockchain txn
  if (lpToken1 !== null && lpToken2 !== null && showAwaitingTxn) {
    txnDescLine1 = `Generating ${lpToken1.symbol.toUpperCase()}/${lpToken2.symbol.toUpperCase()}`;
    txnDescLine2 = `${dexName} LP Tokens `;
  }


  return (
    <div className="awaiting-txn-desc">
      {txnDescLine1}
      <br className="awaiting-txn-desc-line-break" />
      {txnDescLine2}
    </div>
  );
};

const UnwrapAwaitingTxnsWrapper = () => {
  const { showAwaitingTxn } = useSelector((state) => state.transactions);
  const { selectedLpTokenPair, outputTokenValue } = useSelector(
    (state) => state.tokens
  );
  const { liquidityTokenBalance, lpToken1, lpToken2 } = selectedLpTokenPair;

  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  let txnDescLine1 = "";
  let txnDescLine2 = "";
  let txnDescLine3 = "";
  // if none of the LP Tokens is selected and the modal is supposed to be visible, then simulate a blockchain txn
  if (lpToken1 !== null && lpToken2 !== null && showAwaitingTxn) {
    txnDescLine1 = `Unwrapping ${liquidityTokenBalance} ${lpToken1.symbol.toUpperCase()}/${lpToken2.symbol.toUpperCase()}`;
    txnDescLine2 = ` ${dexName} LP Tokens to`;
    txnDescLine3 = ` ${outputTokenValue}`;
    // TODO: this is just a placeholdeer action for now, it should be replaced with a real web3 txn
    const timeoutId = setTimeout(() => {
      dispatch(showAwaitingTxnModal({ showAwaitingTxn: false }));
      navigate("/success");
      clearTimeout(timeoutId);
    }, 6000);
  }

  const dispatch = useDispatch();

  return (
    <div className="awaiting-txn-desc">
      {txnDescLine1}
      <br className="awaiting-txn-desc-line-break" />
      {txnDescLine2}
      <br />
      {txnDescLine3}
    </div>
  );
};

const RemixAwaitingTxnsWrapper = () => {
  const { showAwaitingTxn } = useSelector((state) => state.transactions);
  const { selectedLpTokenPair, newLPTokens } = useSelector(
    (state) => state.tokens
  );
  const { liquidityTokenBalance, lpToken1, lpToken2 } = selectedLpTokenPair;

  const tokens = useSelector((state) => state.tokens);
  const { dexes, selectedDex, newDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const newDexName = dexes[newDex].name;
  let txnDesc = [];
  // if none of the LP Tokens is selected and the modal is supposed to be visible, then simulate a blockchain txn
  if (lpToken1 !== null && lpToken2 !== null && showAwaitingTxn) {
    txnDesc[0] = `Remixing ${liquidityTokenBalance} ${lpToken1.symbol.toUpperCase()}/${lpToken2.symbol.toUpperCase()}`;
    txnDesc[1] = ` ${dexName} LP Tokens to `;
    txnDesc[2] = `${newLPTokens} ${tokens.lpToken1.symbol.toUpperCase()}/${tokens.lpToken2.symbol.toUpperCase()} `;
    txnDesc[3] = `${newDexName} LP Tokens`;
    // TODO: this is just a placeholdeer action for now, it should be replaced with a real web3 txn
    const timeoutId = setTimeout(() => {
      dispatch(showAwaitingTxnModal({ showAwaitingTxn: false }));
      navigate("/success");
      clearTimeout(timeoutId);
    }, 6000);
  }

  const dispatch = useDispatch();

  return (
    <div className="awaiting-txn-desc">
      {txnDesc.map((line,id) => (
        <div key={id}>
          {line}
          <br className="awaiting-txn-desc-line-break" />
        </div>
      ))}
    </div>
  );
};

export default AwaitingTxnsWrapper;
