import "./index.scss";
// bootstrap
import { InputGroup, FormControl, Row, Col } from "react-bootstrap";

// import the images
import placeHolderX from "../../assets/images/token-selector.svg";
import selectorIcon from "../../assets/images/selector.svg";
import pair from "../../assets/images/pair.svg";
import arrowUp from "../../assets/images/arrow-up.svg";

// redux
import { useDispatch, useSelector } from "react-redux";
import { showSearchModal, setMax, setNewInputAmount } from "../../redux/tokens";

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
  const lpPair = token1.symbol + "/" + token2.symbol;

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
  const { displayName, symbol, tokenIcon } = props.token;

  return (
    <div className="select-token">
      <TokenIconView tokenIcon={tokenIcon} tokenIconSize={52} />
      <div className="selected-token">
        <span className="selected-token-name">{displayName}</span>
        <br />
        <span className="selected-token-symbol">
          {symbol}
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
    if (inputToken.balance > 0) {
      placeholder =
        inputToken.balance + " " + inputToken.symbol.toUpperCase();
    }
  }

  return placeholder;
};

const InputTokenView = () => {
  const { inputToken, lpToken1Value, lpToken2Value, showMax, inputTokenValue } =
    useSelector((state) => state.tokens);
  const [inputAmount, setInputAmount] = useState(inputTokenValue);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    inputRef.current.focus();
    if (inputToken) setInputAmount(inputToken.balance);
    else setInputAmount("");
  }, [inputToken]);
  const handleInputChange = (value) => {
    if (/^(|[0-9]\d*)(\.\d*)?$/.test(value)) {
      setInputAmount(value);
    }
  };
  const handleInputFocus = (value) => {
    const newInputAmount = value.split(" ")[0];
    if (newInputAmount) setInputAmount(newInputAmount.trim());
  };
  const appendTokenName = useCallback(
    (value) => {
      return value + " " + inputToken.symbol.toUpperCase();
    },
    [inputToken]
  );
  const validateValue = useCallback(
    (value) => {
      const userBalance = inputToken.balance;
      let validatedValue = value.trim();
      if (validatedValue.length) {
        if (validatedValue > userBalance) validatedValue = userBalance;
        if (validatedValue <= 0) validatedValue = "";
      }
      return validatedValue;
    },
    [inputToken]
  );
  const handleInputBlur = useCallback(
    (value) => {
      const validValue = validateValue(value.toString());

      if (validValue.toString().length) {
        setInputAmount(appendTokenName(validValue));
        // we only do the re-calculation if the lp token values have been set
        if (lpToken1Value !== "" && lpToken2Value !== "") {
          dispatch(setNewInputAmount({ inputTokenAmount: validValue }));
        }
      } else {
        setInputAmount(validValue); // we only do the re-calculation if the lp token values have been set
        if (lpToken1Value !== "" && lpToken2Value !== "") {
          dispatch(setNewInputAmount({ inputTokenAmount: 0 }));
        }
      }
    },
    [lpToken1Value, lpToken2Value, validateValue, appendTokenName, dispatch]
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
          inputToken.balance > 0 ? (
            <InputGroup.Append
              onClick={() => {
                setInputAmount(appendTokenName(inputToken.balance));
                dispatch(setMax());
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
  const { inputToken, lpToken1, lpToken2, lpToken1Value, lpToken2Value } = useSelector((state) => state.tokens);
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

const RemixTokenView = () => {
  const { lpToken1, lpToken2 } = useSelector((state) => state.tokens);
  const dispatch = useDispatch();

  return (
    <div>
      <div className="token-label">Select Tokens</div>
      <Row className="select-input-token">
        <Col
          lg="4"
          className="lp-token1"
          onClick={() =>
            dispatch(
              showSearchModal({
                showSearch: true,
                searchCaller: constants.lpToken1,
              })
            )
          }
        >
          {lpToken1 === null ? <SelectTokenView /> : <SetLPToken1 />}
        </Col>

        <Col
          lg="4"
          className="lp-token1"
          onClick={() =>
            dispatch(
              showSearchModal({
                showSearch: true,
                searchCaller: constants.lpToken2,
              })
            )
          }
        >
          {lpToken2 === null ? <SelectTokenView /> : <SetLPToken2 />}
        </Col>
      </Row>
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
  if (viewType === tokenViewTypes.remixToken) {
    element = <RemixTokenView />;
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
