import "./index.scss";

import { Button } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setTxnStatus, showConfirmModal } from "../../redux/transactions";
import { resetState, setMax } from "../../redux/tokens";

// button view types
import { tokenViewTypes } from "../../utils";
import { resetUnwrapState, setUnwrapTokensValue } from "../../redux/unwrap";
import { navigate } from "hookrouter";

// this component is responsible for handling all the blockchain txn's in the app
const InputButton = () => {
  const {
    inputToken,
    lpToken1,
    lpToken2,
    inputTokenValue,
    lpToken1Value,
    lpToken2Value,
  } = useSelector((state) => state.tokens);
  const allTokensNotSelected =
    inputToken === null || lpToken1 === null || lpToken2 === null;
  const allTokenValuesNotSet =
    inputTokenValue === "" || lpToken1Value === "" || lpToken2Value === "";
  const disableBtn = allTokensNotSelected || allTokenValuesNotSet;

  let btnText = disableBtn
    ? allTokensNotSelected
      ? "Input Amount & Select Tokens"
      : "Input Amount"
    : "Review Transaction";

  const dispatch = useDispatch();

  return disableBtn ? (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount"
      disabled={disableBtn}
    >
      {btnText}
    </Button>
  ) : (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount confirm-lp"
      disabled={disableBtn}
      onClick={() => dispatch(showConfirmModal({ showConfirm: true }))}
    >
      {btnText}
    </Button>
  );
};

const OutputButton = () => {
  const { outputToken } = useSelector((state) => state.tokens);
  const disableBtn = outputToken === null;

  let btnText = disableBtn ? "Select Output Token" : "Confirm Unwrapping";

  const dispatch = useDispatch();
  return (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount"
      disabled={disableBtn}
      onClick={() => dispatch(showConfirmModal({ showConfirm: true }))}
    >
      {btnText}
    </Button>
  );
};

const RemixButton = () => {
  const { lpToken1, lpToken2 } = useSelector((state) => state.tokens);
  const disableBtn = lpToken2 === null || lpToken1 == null;

  let btnText = disableBtn ? "Select Tokens" : "Confirm Remix";

  const dispatch = useDispatch();
  return (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount"
      disabled={disableBtn}
      onClick={() => {
       
        dispatch(setMax());
        dispatch(setUnwrapTokensValue({ outputToken: null }));

        dispatch(showConfirmModal({ showConfirm: true }));
      }}
    >
      {btnText}
    </Button>
  );
};

const GenerateMoreLPS = () => {
  const dispatch = useDispatch();
  return (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount confirm-lp"
      onClick={() => {
        // clear the global state
        dispatch(resetState());
        dispatch(setTxnStatus({txnStatus:null}));
        navigate("/");
      }}
    >
      Generate New LP Tokens
    </Button>
  );
};

const UnwrapMoreLPS = () => {
  const dispatch = useDispatch();
  return (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount confirm-lp"
      onClick={() => {
        // clear the global state
        dispatch(resetUnwrapState());
        navigate("/unwrap");
      }}
    >
      Unwrap More LP Tokens
    </Button>
  );
};

const RemixMoreLPS = () => {
  const dispatch = useDispatch();
  return (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount confirm-lp"
      onClick={() => {
        // clear the global state
        dispatch(resetState());
        dispatch(resetUnwrapState());
        navigate("/remix");
      }}
    >
      Remix More LP Tokens
    </Button>
  );
};

const Transaction = ({ viewType }) => {
  let element = null;

  if (viewType === tokenViewTypes.inputButton) {
    element = <InputButton />;
  }

  if (viewType === tokenViewTypes.outputButton) {
    element = <OutputButton />;
  }

  if (viewType === tokenViewTypes.remixButton) {
    element = <RemixButton />;
  }

  if (viewType === tokenViewTypes.generateMoreLPsButton) {
    element = <GenerateMoreLPS />;
  }

  if (viewType === tokenViewTypes.unwrapMoreLPsButton) {
    element = <UnwrapMoreLPS />;
  }
  if (viewType === tokenViewTypes.remixMoreLPsButton) {
    element = <RemixMoreLPS />;
  }
  return element;
};

export default Transaction;
