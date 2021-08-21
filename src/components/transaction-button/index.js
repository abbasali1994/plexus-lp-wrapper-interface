import "./index.scss";

import { useState, useEffect } from "react";

import { Button } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import { resetTxnState, showConfirmModal } from "../../redux/transactions";
<<<<<<< HEAD
import { resetState, setRemixValues } from "../../redux/tokens";
import { setTradeErrors, resetErrors } from "../../redux/errors";
=======
import { resetState, setRemixValues, setPaths } from "../../redux/tokens";
>>>>>>> 5a711a3 (final lp wrapper changes)
import { getGasPrices } from "../../redux/prices";
import spinner from "../../assets/gifs/confirmation.gif";
// button view types
import { tokenViewTypes } from "../../utils";
import { navigate } from "hookrouter";

//constants
import { constants } from "../../utils";

// contract calls
import { checkIfPairExists } from "../../utils/webThreeUtils";
import { fetchBestRoutes } from "../../utils/tradeRoutes";

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
    : "Generate Transaction";

  const [buttonDisabled, setButtonDisabled] = useState(disableBtn);
  const [buttonText, setButtonText] = useState(btnText);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setButtonDisabled(disableBtn);
    setButtonText(btnText);
  }, [btnText, disableBtn, inputToken, lpToken1, lpToken2, dexName]);

  const dispatch = useDispatch();

  const handleButtonClick = async () => {
<<<<<<< HEAD
    dispatch(resetErrors());
=======

    // show loading spinner and disable button
    setLoading(true);
    setButtonDisabled(true);
    setButtonText(`Generating Transaction..`);

    // do the necesary checks here
>>>>>>> 5a711a3 (final lp wrapper changes)
    let pairAddress = constants.ZERO_ADDRESS;

    pairAddress = await checkIfPairExists(
      dexName,
      lpToken1.address,
      lpToken2.address
    );

    if (pairAddress === constants.ZERO_ADDRESS) {
    
      const token1Symbol = lpToken1.symbol;
      const token2Symbol = lpToken2.symbol;
      const pairSymbol = token1Symbol + "-" + token2Symbol;

      setButtonText(`Invalid ${dexName} (${pairSymbol}) LP Pair!`);
      setLoading(false);
    } else {
     
      const inputAmount = inputTokenValue / 2;
<<<<<<< HEAD
      // const inputAmountWei = numberToWei(inputAmount.toString(), inputToken.decimals);
=======
      
      const routes1 = await fetchBestRoutes(dexName, inputToken, lpToken1, inputAmount.toString());
      const routes2 = await fetchBestRoutes(dexName, inputToken, lpToken2, inputAmount.toString());
      // we assume index 0 paths are the best
      const wrapPaths = [routes1[0].routePathArray, routes2[0].routePathArray];

      // we set the best wrap paths
      dispatch(setPaths({type: constants.wrapPaths, paths: wrapPaths}));

      // dispatch a gas request again so that we have the latest gas cost svalues
      dispatch(getGasPrices());


      setButtonDisabled(false);
      setLoading(false);
      setButtonText("Generate Transaction");

>>>>>>> 5a711a3 (final lp wrapper changes)

      const token1Routes = await fetchBestRoutes(
        dexName,
        inputToken,
        lpToken1,
        inputAmount.toString()
      );
      if(token1Routes.error) {
        dispatch(setTradeErrors({ error: token1Routes.error }));
        return;
      }
      const token2Routes = await fetchBestRoutes(
        dexName,
        inputToken,
        lpToken2,
        inputAmount.toString()
      );
      if(token2Routes.error) {
        dispatch(setTradeErrors({ error: token2Routes.error }));
        return;
      }
      // TODO: Revist in another iteration and fix
      // const token1 = { lpToken1, lpToken1Amount };
      // const token2  = { lpToken2, lpToken2Amount };

      // getLpTokensEstimate(pairAddress, token1, token2);

     

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
      onClick={() => dispatch(showConfirmModal({ showConfirm: true }))}
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
      pairAddress = await checkIfPairExists(lpToken1.address, lpToken2.address);
      pair = await queryPairDetails(uniClient, pairAddress);
    }

    if (dexName === constants.dexSushi) {
      pairAddress = await checkIfPairExists(lpToken1.address, lpToken2.address);
      pair = await queryPairDetails(sushiClient, pairAddress);
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
        dispatch(resetErrors());
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
        dispatch(resetErrors());
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
        dispatch(resetErrors());
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
