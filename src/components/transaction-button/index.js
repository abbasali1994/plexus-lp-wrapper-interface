import "./index.scss";

import { useState, useEffect } from "react";

import { Button } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import { resetTxnState, showConfirmModal } from "../../redux/transactions";
import { resetState, setRemixValues } from "../../redux/tokens";
import { getGasPrices } from "../../redux/prices";
import spinner from "../../assets/gifs/confirmation.gif";
// button view types
import { tokenViewTypes } from "../../utils";
import { navigate } from "hookrouter";

//constants
import { constants } from "../../utils";

// contract calls
import { checkIfPairExists, numberToWei} from "../../utils/webThreeUtils";
import { fetchBestTrades } from "../../utils/trades";

// graphql calls
import { queryPairDetails } from "../../gql";
import { client as sushiClient } from "../../gql/sushiswap";
import { client as uniClient } from "../../gql/uniswap";

// this component is responsible for handling all the blockchain txn's in the app
const InputButton = () => {
  const {
    inputToken,
    lpToken1,
    lpToken2,
    inputTokenValue,
    lpToken1Value,
    lpToken2Value
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

  const handleButtonClick = async () => {
    let pairAddress = constants.ZERO_ADDRESS;
    if (dexName === constants.dexUni) {
      pairAddress = await checkIfPairExists(
        dexName,
        lpToken1.address,
        lpToken2.address
      );
    }

    if (dexName === constants.dexSushi) {
      pairAddress = await checkIfPairExists(
        dexName,
        lpToken1.address,
        lpToken2.address
      );
    }

    if (pairAddress === constants.ZERO_ADDRESS) {
      setButtonDisabled(true);
      const token1Symbol = lpToken1.symbol;
      const token2Symbol = lpToken2.symbol;
      const pairSymbol = token1Symbol + "-" + token2Symbol;

      setButtonText(`Invalid ${dexName} (${pairSymbol}) LP Pair!`);
    } else {
      setButtonDisabled(false);
      setButtonText("Review Transaction");

      const inputAmount = inputTokenValue / 2;
      const inputAmountWei = numberToWei(inputAmount.toString(), inputToken.decimals);
      
      await fetchBestTrades(dexName, inputToken, lpToken1, inputAmountWei);
      await fetchBestTrades(dexName, inputToken, lpToken2, inputAmountWei);

      // TODO: Revist in another iteration and fix
      // const token1 = { lpToken1, lpToken1Amount };
      // const token2  = { lpToken2, lpToken2Amount };

      // getLpTokensEstimate(pairAddress, token1, token2);

      // dispatch a gas request again so that we have the latest gas cost svalues
      dispatch(getGasPrices());

      // then show the confirm modal
      // TODO: We'll enable this once we add the MEV handling logic
      // dispatch(showConfirmPrivacyModal({ showConfirmPrivacy: true }));

      // show the txn confirmation modal
      dispatch(showConfirmModal({ showConfirm: true }));
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
        dispatch(showConfirmModal({ showConfirm: true }))
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

  const handleButtonClick = async () => {
    setLoading(true);
    let pairAddress = constants.ZERO_ADDRESS;
    let pair = null;
    if (dexName === constants.dexUni) {
      pairAddress = await checkIfPairExists(
        lpToken1.address,
        lpToken2.address
      );
      pair = await queryPairDetails(uniClient,pairAddress);
    }

    if (dexName === constants.dexSushi) {
      pairAddress = await checkIfPairExists(
        lpToken1.address,
        lpToken2.address
      );
      pair = await queryPairDetails(sushiClient,pairAddress);
    }

    if (pairAddress === constants.ZERO_ADDRESS) {
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
      dispatch(showConfirmModal({ showConfirm: true }));
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
