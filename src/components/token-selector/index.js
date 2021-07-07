import "./index.scss";
// bootstrap
import { InputGroup, FormControl } from "react-bootstrap";

// import the images
import placeHolderX from "../../assets/images/token-selector.svg";
import selectorIcon from "../../assets/images/selector.svg";
import pair from "../../assets/images/pair.svg";
import arrowUp from "../../assets/images/arrow-up.svg";

// redux
import { useDispatch, useSelector } from "react-redux";
import { showSearchModal, setTokensValue } from "../../redux/tokens";

// utils
import { constants, tokenViewTypes } from "../../utils";
import { useState, useEffect, useCallback, useRef } from "react";
import { setUnwrapTokensValue } from "../../redux/unwrap";

// The single token icon view
const TokenIconView = ({ tokenIcon, tokenIconSize }) => {
  const tokenIconSelected = tokenIconSize === 32 ? "" : "token-selected-icon";
  return (
    <div className="token-selector">
      <div className="token-background">
        <img
          className={tokenIconSelected}
          src={tokenIcon}
          alt="token icon"
          width={tokenIconSize}
          height={tokenIconSize}
        />
      </div>
    </div>
  );
};

// The lp token view
export const LpTokenIconView = ({ tokenIcon, tokenIconSize }) => {
  const tokenIconSelected =
    tokenIconSize === 32 ? "" : "lp-token-selected-icon";
  return (
    <div className="lp-token-selector">
      <div className="lp-token-background">
        <img
          className={tokenIconSelected}
          src={tokenIcon}
          alt="token icon"
          width={tokenIconSize}
          height={tokenIconSize}
        />
      </div>
    </div>
  );
};

// Input token view shown in the confirm popup
const SupplyingLPTokenView = ({ token }) => {
  const { tokenAmount, tokenAmountUSD, tokenIcon } = token;

  return (
    <div className="select-token">
      <TokenIconView tokenIcon={tokenIcon} tokenIconSize={54} />
      <div className="selected-token supply-token">
        <span className="supply-token-amount">{tokenAmount}</span>
        <br />
        <span className="supply-token-amount-usd">{tokenAmountUSD}</span>
      </div>
    </div>
  );
};

// Pair token view shown in the confirm popup
const GeneratingLPTokenView = ({ lpTokens }) => {
  const { token1, token2, dexName } = lpTokens;
  const lpPair = token1.tokenSymbol + "/" + token2.tokenSymbol;

  return (
    <div className="horizontal-lp-view">
      <div className="select-token">
        <LpTokenIconView tokenIcon={token1.tokenIcon} tokenIconSize={51} />
      </div>
      <img
        className="lp-pair-icon"
        src={pair}
        width="16"
        height="46"
        alt="pair"
      />
      <div className="select-token">
        <LpTokenIconView tokenIcon={token2.tokenIcon} tokenIconSize={51} />
      </div>
      <div className="lp-pair-info">
        <div className="lp-pair-text">{lpPair}</div>
        <div className="lp-pair-desc">
          <span className="lp-pair-dex">{dexName} &nbsp;</span>
          LP Tokens
        </div>
      </div>
    </div>
  );
};

const SelectTokenView = () => {
  return (
    <div className="select-token">
      <TokenIconView tokenIcon={placeHolderX} tokenIconSize={32} />
      <span className="select-token-text">
        Select a Token
        <img src={selectorIcon} alt="select icon" width="15" height="15" />
      </span>
    </div>
  );
};

const SelectedTokenView = (props) => {
  const { tokenDisplayName, tokenSymbol, tokenIcon } = props.token;

  return (
    <div className="select-token">
      <TokenIconView tokenIcon={tokenIcon} tokenIconSize={52} />
      <div className="selected-token">
        <span className="selected-token-name">{tokenDisplayName}</span>
        <br />
        <span className="selected-token-symbol">
          {tokenSymbol}
          <img src={selectorIcon} alt="select icon" width="15" height="15" />
        </span>
      </div>
    </div>
  );
};

const SetInputToken = () => {
  const { inputToken } = useSelector((state) => state.tokens);
  return <SelectedTokenView token={inputToken} />;
};

const SetOutputToken = () => {
  const { outputToken } = useSelector((state) => state.tokens);
  const dispatch = useDispatch();
  dispatch(
    setUnwrapTokensValue({
      outputToken,
    })
  );
  return <SelectedTokenView token={outputToken} />;
};

const SetLPToken1 = () => {
  const { lpToken1 } = useSelector((state) => state.tokens);
  return <SelectedTokenView token={lpToken1} />;
};

const SetLPToken2 = () => {
  const { lpToken2 } = useSelector((state) => state.tokens);
  return <SelectedTokenView token={lpToken2} />;
};

const setInputPlaceholder = (inputToken) => {
  let placeholder = "0.00";

  if (inputToken !== null) {
    if (inputToken.tokenBal > 0) {
      placeholder =
        inputToken.tokenBal + " " + inputToken.tokenSymbol.toUpperCase();
    }
  }

  return placeholder;
};

const InputTokenView = () => {
  const { inputToken, lpToken1, lpToken2, showMax, inputTokenValue } =
    useSelector((state) => state.tokens);
  const [inputAmount, setInputAmount] = useState(inputTokenValue);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setInputAmount(inputTokenValue);
  }, [inputTokenValue]);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputToken]);

  const handleInputChange = (value) => {
    if (/^(|[1-9]\d*)(\.\d*)?$/.test(value)) {
      setInputAmount(value);
    }
  };
  const handleInputFocus = (value) => {
    const newInputAmount = value.split(" ")[0];
    if (newInputAmount) setInputAmount(newInputAmount.trim());
  };
  const handleInputBlur = useCallback(
    (value) => {
      if (value.trim().length) {
        const newInputAmount =
          value.trim() + " " + inputToken.tokenSymbol.toUpperCase();
        setInputAmount(newInputAmount);
      }
    },
    [inputToken]
  );

  return (
    <div className="select-input-token">
      <div
        onClick={() =>
          dispatch(
            showSearchModal({
              showSearch: true,
              searchCaller: constants.inputToken,
            })
          )
        }
      >
        {inputToken === null ? <SelectTokenView /> : <SetInputToken />}
      </div>
      <InputGroup className="mb-3">
        <FormControl
          className="input-token-text"
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          placeholder={setInputPlaceholder(inputToken)}
          disabled={inputToken === null}
          value={inputAmount}
          ref={inputRef}
          onBlur={(evt) => handleInputBlur(evt.target.value)}
          onFocus={(evt) => handleInputFocus(evt.target.value)}
          onChange={(evt) => handleInputChange(evt.target.value)}
        />
        {showMax ? (
          inputToken.tokenBal > 0 ? (
            <InputGroup.Append
              onClick={() => {
                // for now we'll mock this and redo it later with real values
                const tokens = {
                  input:
                    inputToken.tokenBal +
                    " " +
                    inputToken.tokenSymbol.toUpperCase(),
                  lp1: "103.5678 " + lpToken1.tokenSymbol.toUpperCase(),
                  lp2: "206.0873 " + lpToken2.tokenSymbol.toUpperCase(),
                };

                dispatch(setTokensValue(tokens));
              }}
            >
              <InputGroup.Text id="max-token">
                max
                <img src={arrowUp} alt="up-arrow" width="13" height="13" />
              </InputGroup.Text>
            </InputGroup.Append>
          ) : null
        ) : null}
      </InputGroup>
    </div>
  );
};

const OutputTokenView = () => {
  const { outputToken } = useSelector((state) => state.tokens);
  const { outputTokenValue } = useSelector((state) => state.unwrap);
  const dispatch = useDispatch();

  return (
    <div className="select-input-token">
      <div
        onClick={() => {
          dispatch(
            showSearchModal({
              showSearch: true,
              searchCaller: constants.outputToken,
            })
          );
          // call contract to calc output value
        }}
      >
        {outputToken === null ? <SelectTokenView /> : <SetOutputToken />}
      </div>

      <InputGroup className="mb-3">
        <FormControl
          className="input-token-text"
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          placeholder="0.00"
          disabled={true}
          value={outputTokenValue}
        />
      </InputGroup>
    </div>
  );
};

const LPTokenView = () => {
  const { inputToken, lpToken1, lpToken2, lpToken1Value, lpToken2Value } =
    useSelector((state) => state.tokens);
  const dispatch = useDispatch();

  return (
    <div className={inputToken === null ? "input-disabled" : ""}>
      <div className="token-label">Select Token Pair</div>
      <div className="select-lp1-token">
        <div
          className="lp-token1"
          onClick={
            inputToken === null
              ? null
              : () =>
                  dispatch(
                    showSearchModal({
                      showSearch: true,
                      searchCaller: constants.lpToken1,
                    })
                  )
          }
        >
          {lpToken1 === null ? <SelectTokenView /> : <SetLPToken1 />}
        </div>
        <InputGroup className="mb-3">
          <FormControl
            className="input-token-text"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            placeholder="0.00"
            disabled={true}
            value={lpToken1Value}
          />
        </InputGroup>
      </div>
      <img
        className="pair-icon"
        src={pair}
        width="13"
        height="37"
        alt="pair-icon"
      />
      <div className="select-lp2-token">
        <div
          className="lp-token2"
          onClick={
            inputToken === null
              ? null
              : () =>
                  dispatch(
                    showSearchModal({
                      showSearch: true,
                      searchCaller: constants.lpToken2,
                    })
                  )
          }
        >
          {lpToken2 === null ? <SelectTokenView /> : <SetLPToken2 />}
        </div>
        <InputGroup className="mb-3">
          <FormControl
            className="input-token-text"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            placeholder="0.00"
            disabled={true}
            value={lpToken2Value}
          />
        </InputGroup>
      </div>
    </div>
  );
};

const TokenSelector = (props) => {
  const { viewType } = props;
  let element = null;

  if (viewType === tokenViewTypes.inputToken) {
    element = <InputTokenView />;
  }
  if (viewType === tokenViewTypes.outputToken) {
    element = <OutputTokenView />;
  }
  if (viewType === tokenViewTypes.selectLPPair) {
    element = <LPTokenView />;
  }
  if (viewType === tokenViewTypes.supplyingLP) {
    element = <SupplyingLPTokenView token={props.token} />;
  }
  if (viewType === tokenViewTypes.generatingLP) {
    element = <GeneratingLPTokenView lpTokens={props.lpTokens} />;
  }

  return element;
};

export default TokenSelector;
