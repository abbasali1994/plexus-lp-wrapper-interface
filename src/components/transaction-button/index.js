import "./index.scss";

import { useState, useEffect } from "react";

import { Button } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  resetTxnState,
  showConfirmPrivacyModal,
} from "../../redux/transactions";
import { resetState, setRemixValues } from "../../redux/tokens";
import { getGasPrices } from "../../redux/prices";
import spinner from "../../assets/gifs/confirmation.gif";
// button view types
import { tokenViewTypes } from "../../utils";
import { navigate } from "hookrouter";

//constants
import { constants } from "../../utils";

// contract calls
import {
  checkIfUniPairExists,
  checkIfSushiPairExists,
} from "../../utils/wallet";
import { fetchPairDetails as fetchSushiPairDetails } from "../../gql/sushiswap";
import { fetchPairDetails as fetchUniPairDetails } from "../../gql/uniswap";
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
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const allTokensNotSelected =
    inputToken === null || lpToken1 === null || lpToken2 === null;
  const allTokenValuesNotSet =
    inputTokenValue === "" || lpToken1Value === "" || lpToken2Value === "";
  const disableBtn = allTokensNotSelected || allTokenValuesNotSet;
  const btnText = disableBtn
    ? allTokensNotSelected
      ? "Input Amount & Select Tokens"
      : "Input Amount"
    : "Review Transaction";

  const [buttonDisabled, setButtonDisabled] = useState(disableBtn);
  const [buttonText, setButtonText] = useState(btnText);

  useEffect(() => {
    setButtonDisabled(disableBtn);
    setButtonText(btnText);
  }, [btnText, disableBtn, inputToken, lpToken1, lpToken2, dexName]);

  const dispatch = useDispatch();
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  const handleButtonClick = async () => {
    let pairAddress = ZERO_ADDRESS;
    if (dexName === constants.dexUni) {
      pairAddress = await checkIfUniPairExists(
        lpToken1.address,
        lpToken2.address
      );
    }

    if (dexName === constants.dexSushi) {
      pairAddress = await checkIfSushiPairExists(
        lpToken1.address,
        lpToken2.address
      );
    }

    if (pairAddress === ZERO_ADDRESS) {
      setButtonDisabled(true);
      const token1Symbol = lpToken1.symbol;
      const token2Symbol = lpToken2.symbol;
      const pairSymbol = token1Symbol + "-" + token2Symbol;

      setButtonText(`Invalid ${dexName} (${pairSymbol}) LP Pair!`);
    } else {
      setButtonDisabled(false);
      setButtonText("Review Transaction");

      // dispatch a gas request again so that we have the latest values
      dispatch(getGasPrices());

      // then show the confirm modal
      dispatch(showConfirmPrivacyModal({ showConfirmPrivacy: true }));
    }
  };

  return buttonDisabled ? (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount"
      disabled={buttonDisabled}
    >
      {buttonText}
    </Button>
  ) : (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount confirm-lp"
      disabled={buttonDisabled}
      onClick={() => handleButtonClick()}
    >
      {buttonText}
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
      onClick={() =>
        dispatch(showConfirmPrivacyModal({ showConfirmPrivacy: true }))
      }
    >
      {btnText}
    </Button>
  );
};

const RemixButton = () => {
  const { lpToken1, lpToken2 } = useSelector((state) => state.tokens);
  const { dexes, newDex } = useSelector((state) => state.dexes);

  const dexName = dexes[newDex].name;
  const disableBtn = lpToken2 === null || lpToken1 == null;
  let btnText = disableBtn ? "Select Tokens" : "Confirm Remix";

  const [buttonDisabled, setButtonDisabled] = useState(disableBtn);
  const [buttonText, setButtonText] = useState(btnText);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  const handleButtonClick = async () => {
    setLoading(true);
    let pairAddress = ZERO_ADDRESS;
    let pair = null;
    if (dexName === constants.dexUni) {
      pairAddress = await checkIfUniPairExists(
        lpToken1.address,
        lpToken2.address
      );
      pair = await fetchUniPairDetails(pairAddress);
    }

    if (dexName === constants.dexSushi) {
      pairAddress = await checkIfSushiPairExists(
        lpToken1.address,
        lpToken2.address
      );
      pair = await fetchSushiPairDetails(pairAddress);
    }

    if (pairAddress === ZERO_ADDRESS) {
      setButtonDisabled(true);
      const token1Symbol = lpToken1.symbol;
      const token2Symbol = lpToken2.symbol;
      const pairSymbol = token1Symbol + "-" + token2Symbol;

      setButtonText(`Invalid ${dexName} (${pairSymbol}) LP Pair!`);
    } else {
      setButtonText("Confirm Remix");

      // dispatch a gas request again so that we have the latest values
      dispatch(getGasPrices());

      // then show the confirm modal
      dispatch(showConfirmPrivacyModal({ showConfirmPrivacy: true }));
      if (pair) {
        dispatch(setRemixValues({ pair }));
        setButtonDisabled(false);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    setButtonDisabled(disableBtn);
    setButtonText(btnText);
  }, [btnText, disableBtn, lpToken1, lpToken2, dexName]);
  return (
    <Button
      variant="primary"
      size="lg"
      block
      className="input-amount"
      disabled={buttonDisabled}
      onClick={() => handleButtonClick()}
    >
      {buttonText}{" "}
      {loading && (
        <img
          className="token-icon"
          src={spinner}
          alt={"loading"}
          width="36"
          height="36"
        />
      )}
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
        dispatch(resetTxnState());
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
        navigate("/unwrap");
        // clear the global state
        dispatch(resetState());
        dispatch(resetTxnState());
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
        navigate("/remix");
        // clear the global state
        dispatch(resetState());
        dispatch(resetTxnState());
        
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
