import { useState, useEffect } from "react";
import "./index.scss";

// bootstrap
import { Modal, Button } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  showConfirmModal,
  showAwaitingTxnModal,
  setTxnStatus,
} from "../../../redux/transactions";
import { setNetworkValues } from "../../../redux/tokens";

// token selector component
import TokenSelector from "../../token-selector";

// arrow
import arrowDown from "../../../assets/images/arrow-down.svg";

// Utils
import { constants, tokenViewTypes } from "../../../utils";
import {  wrapTokens } from "../../../utils/wrap";
import { formatAmount } from "../../../utils/display";
import { navigate } from "hookrouter";

const ConfirmLPModal = ({ theme }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const { showConfirm } = useSelector((state) => state.transactions);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });

  let element =
    width > constants.width.mobile && showConfirm ? (
      <DesktopWrapper theme={theme} />
    ) : (
      ""
    );

  return element;
};

const DesktopWrapper = ({ theme }) => {
  const { activeAction } = useSelector((state) => state.dexes);
  const { inputToken, inputTokenValue, lpToken1, lpToken2 } = useSelector(
    (state) => state.tokens
  );
  const { gasPrices } = useSelector((state) => state.prices);
  const { pricesUSD } = useSelector((state) => state.prices);
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;

  const dispatch = useDispatch();
  const handleButtonClick = () => {
    dispatch(showConfirmModal({ showConfirm: false }));
    switch (activeAction) {
      case "Unwrap":
        content = unwrap();
        break;
      case "Remix":
        content = remix();
        break;

      default:
        content = wrap();
    }
  };
  const wrap = async () => {
    dispatch(showConfirmModal({ showConfirm: false }));

    if (
      lpToken1 !== null &&
      lpToken2 !== null &&
      inputToken !== null &&
      inputTokenValue !== ""
    ) {
      dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));

      const res = await wrapTokens(
        dexName,
        inputToken,
        inputTokenValue,
        lpToken1,
        lpToken2,
        gasPrices.fast,
        pricesUSD["ethereum"].usd
      );

      // user rejected txn
      if (res.code === 4001) {
        dispatch(setTxnStatus({ txnStatus: "rejected" }));
      } else {
        if (res.txnHash !== undefined && res.txnHash !== null) {
          dispatch(setTxnStatus({ txnStatus: "success" }));
          dispatch(setNetworkValues(res));
          navigate("/success");
        } else {
          dispatch(setTxnStatus({ txnStatus: "rejected" }));
          navigate("/rejected");
        }
      }

      dispatch(showAwaitingTxnModal({ showAwaitingTxn: false }));
    }
  };
  const unwrap = async () => {
    dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));
    dispatch(
      setNetworkValues({
        networkFeeETH: "0.008654 ETH",
        networkFeeUSD: "~$17.35",
        txnHash: "",
      })
    );
  };
  const remix = async () => {
    dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));
    dispatch(
      setNetworkValues({
        networkFeeETH: "0.008654 ETH",
        networkFeeUSD: "~$17.35",
        txnHash: "",
      })
    );
  };
  let content = "";
  switch (activeAction) {
    case "Unwrap":
      content = <ModalUnwrapLPWrapper />;
      break;
    case "Remix":
      content = <ModalRemixLPWrapper />;
      break;

    default:
      content = <ModalConfirmLPWrapper />;
  }

  return (
    <Modal
      className={theme}
      show={true}
      onHide={() => dispatch(showConfirmModal({ showConfirm: false }))}
      backdrop="static"
      keyboard={false}
      animation={true}
    >
      {content}
      <Modal.Footer className="confirm-popup-footer">
        <Button
          variant="primary"
          size="lg"
          block
          className="confirm-tx"
          onClick={() => handleButtonClick()}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
const ModalConfirmLPWrapper = () => {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Confirm LP Generation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ConfirmLPContent />
      </Modal.Body>
    </>
  );
};
export const ConfirmLPContent = () => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const bottomSectionClass =
    dexName === constants.dexSushi
      ? "confirm-popup-bottom-sushi-section"
      : "confirm-popup-bottom-uni-section";

  const {
    inputToken,
    inputTokenValue,
    inputTokenValueUSDFormatted,
    lpToken1,
    lpToken2,
    lpToken1Value,
    lpToken2Value,
    lpToken1ValueUSD,
    lpToken2ValueUSD,
  } = useSelector((state) => state.tokens);

  // the input token prop
  const token = {};
  Object.assign(token, inputToken);
  token.tokenAmount = inputTokenValue + " " + token.symbol.toUpperCase();
  token.tokenAmountUSD = inputTokenValueUSDFormatted;

  // the input token prop
  const token1 = {};
  const token2 = {};
  let lpTokens = {};
  Object.assign(token1, lpToken1);
  Object.assign(token2, lpToken2);

  token1.tokenAmount = lpToken1Value;
  token1.tokenAmountUSD = lpToken1ValueUSD;

  token2.tokenAmount = lpToken2Value;
  token2.tokenAmountUSD = lpToken2ValueUSD;

  lpTokens = { token1, token2, dexName };

  return (
    <div className="confirm-popup-body">
      <div className="confirm-popup-top-section">
        <div className="confirm-popup-content">
          <div className="confirm-popup-header">Supplying</div>
          <div className="supply-details">
            <TokenSelector
              viewType={tokenViewTypes.supplyingLP}
              token={token}
            />
          </div>
        </div>
      </div>
      <img
        className="down-arrow"
        src={arrowDown}
        alt="down arrow"
        width="46"
        height="50"
      />
      <div className={bottomSectionClass}>
        <div className="confirm-popup-content">
          <div className="confirm-popup-header">Generating</div>
          <div className="generate-lp-details">
            <TokenSelector
              viewType={tokenViewTypes.generatingLP}
              lpTokens={lpTokens}
            />
          </div>
          <div className="lp-token-stats">
            <div className="lp-token-value">{lpToken1Value}</div>
            <div className="lp-token-value">{lpToken2Value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalUnwrapLPWrapper = () => {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Confirm LP Unwrapping</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UnwrapLPContent />
      </Modal.Body>
    </>
  );
};
export const UnwrapLPContent = () => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const bottomSectionClass =
    dexName === constants.dexSushi
      ? "confirm-popup-bottom-sushi-section"
      : "confirm-popup-bottom-uni-section";

  const {
    selectedLpTokenPair,
    outputTokenValue,
    outputToken,
    outputTokenValueUSD,
  } = useSelector((state) => state.tokens);
  const { liquidityTokenBalance, lpToken1, lpToken2 } = selectedLpTokenPair;

  // the input token prop
  const token = {};
  Object.assign(token, outputToken);
  token.tokenAmount = outputTokenValue;
  token.tokenAmountUSD = `~$${formatAmount(outputTokenValueUSD)}`;

  // the input token prop
  const token1 = {};
  const token2 = {};
  let lpTokens = {};
  Object.assign(token1, lpToken1);
  Object.assign(token2, lpToken2);

  token1.tokenAmountUSD = token1.tokenAmount * token1.tokenUSDValue;
  token2.tokenAmountUSD = token2.tokenAmount * token2.tokenUSDValue;

  lpTokens = { token1, token2, dexName };

  return (
    <div className="confirm-popup-body">
      <div className="confirm-popup-top-section">
        <div className="confirm-popup-content">
          <div className="confirm-popup-header">Unwrapping</div>
          <div className="generate-lp-details">
            <TokenSelector
              viewType={tokenViewTypes.generatingLP}
              lpTokens={lpTokens}
            />
          </div>
          <div className="lp-token-stats">
            <div className="lp-token-amount">
              {formatAmount(liquidityTokenBalance)} &nbsp; LP Tokens
            </div>
            <div className="lp-token-value">
              {formatAmount(token1.tokenAmount)}{" "}
              {token1.symbol.toUpperCase()}
            </div>
            <div className="lp-token-value">
              {formatAmount(token2.tokenAmount)}{" "}
              {token2.symbol.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
      <img
        className="down-arrow"
        src={arrowDown}
        alt="down arrow"
        width="46"
        height="50"
      />
      <div className={bottomSectionClass}>
        <div className="confirm-popup-content">
          <div className="confirm-popup-header">Recieving</div>
          <div className="supply-details">
            <TokenSelector
              viewType={tokenViewTypes.supplyingLP}
              token={token}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalRemixLPWrapper = () => {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Confirm LP Remix</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RemixLPContent />
      </Modal.Body>
    </>
  );
};
export const RemixLPContent = () => {
  const { dexes, selectedDex, newDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  const newDexName = dexes[newDex].name;
  const bottomSectionClass =
    dexName === constants.dexSushi
      ? "confirm-popup-bottom-sushi-section"
      : "confirm-popup-bottom-uni-section";

  const { selectedLpTokenPair, lpToken1, lpToken2, newLPTokens } = useSelector(
    (state) => state.tokens
  );
  const tokens = useSelector((state) => state.tokens);

  const { lpTokenPrice, liquidityTokenBalance } = selectedLpTokenPair;
  // the input tokens prop
  const toToken1 = {};
  const toToken2 = {};
  Object.assign(toToken1, lpToken1);
  Object.assign(toToken2, lpToken2);
  toToken1.tokenValue = tokens.lpToken1Value;
  toToken1.tokenAmountUSD = tokens.lpToken1Amount * toToken1.tokenUSDValue;

  toToken2.tokenValue = tokens.lpToken2Value;
  toToken2.tokenAmountUSD = tokens.lpToken2Amount * toToken2.tokenUSDValue;

  // the remix token prop
  const fromToken1 = {};
  const fromToken2 = {};
  Object.assign(fromToken1, selectedLpTokenPair.lpToken1);
  Object.assign(fromToken2, selectedLpTokenPair.lpToken2);
  fromToken1.tokenValue = `${formatAmount(
    fromToken1.tokenAmount
  )} ${fromToken1.symbol.toUpperCase()}`;
  fromToken1.tokenAmountUSD = (liquidityTokenBalance / 2) * lpTokenPrice;

  fromToken2.tokenValue = `${formatAmount(
    fromToken2.tokenAmount
  )} ${fromToken2.symbol.toUpperCase()}`;
  fromToken2.tokenAmountUSD = (liquidityTokenBalance / 2) * lpTokenPrice;

  const fromLPTokens = { token1: fromToken1, token2: fromToken2, dexName };
  const toLPTokens = {
    token1: toToken1,
    token2: toToken2,
    dexName: newDexName,
  };

  return (
    <div className="confirm-popup-body">
      <div className="confirm-popup-top-section">
        <div className="confirm-popup-content">
          <div className="confirm-popup-header">Remixing</div>
          <div className="generate-lp-details">
            <TokenSelector
              viewType={tokenViewTypes.generatingLP}
              lpTokens={fromLPTokens}
            />
          </div>
          <div className="lp-token-stats">
            <div className="lp-token-amount">
              {formatAmount(liquidityTokenBalance)} &nbsp; LP
              Tokens
            </div>
            <div className="lp-token-value">
              {`${fromToken1.tokenValue} // ${fromToken2.tokenValue}`}
            </div>
          </div>
        </div>
      </div>
      <img
        className="down-arrow"
        src={arrowDown}
        alt="down arrow"
        width="46"
        height="50"
      />
      <div className={bottomSectionClass}>
        <div className="confirm-popup-content">
          <div className="generate-lp-details">
            <TokenSelector
              viewType={tokenViewTypes.generatingLP}
              lpTokens={toLPTokens}
            />
          </div>
          <div className="lp-token-stats">
            <div className="lp-token-amount">
              {formatAmount(newLPTokens)} &nbsp; LP Tokens
            </div>
            <div className="lp-token-value">
              {`${toToken1.tokenValue} // ${toToken2.tokenValue}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileLPWrapper = () => {
  const { activeAction } = useSelector((state) => state.dexes);
  const { inputToken, inputTokenValue, lpToken1, lpToken2 } = useSelector(
    (state) => state.tokens
  );
  const { gasPrices, pricesUSD } = useSelector((state) => state.prices);
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;

  const dispatch = useDispatch();

  let content = "";

  switch (activeAction) {
    case "Unwrap":
      content = <UnwrapLPContent />;
      break;
    case "Remix":
      content = <RemixLPContent />;
      break;

    default:
      content = <ConfirmLPContent />;
  }

  const handleButtonClick = () => {
    dispatch(showConfirmModal({ showConfirm: false }));
    switch (activeAction) {
      case "Unwrap":
        content = unwrap();
        break;
      case "Remix":
        content = remix();
        break;

      default:
        content = wrap();
    }
  };
  const wrap = async () => {
    if (
      lpToken1 !== null &&
      lpToken2 !== null &&
      inputToken !== null &&
      inputTokenValue !== ""
    ) {
      dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));

      const res = await wrapTokens(
        dexName,
        inputToken,
        inputTokenValue,
        lpToken1,
        lpToken2,
        gasPrices.fast,
        pricesUSD["ethereum"].usd
      );

      // user rejected txn
      if (res.code === 4001) {
        dispatch(setTxnStatus({ txnStatus: "rejected" }));
      } else {
        if (res.txnHash !== undefined && res.txnHash !== null) {
          dispatch(setTxnStatus({ txnStatus: "success" }));
          dispatch(setNetworkValues(res));
          navigate("/success");
        } else {
          dispatch(setTxnStatus({ txnStatus: "rejected" }));
          navigate("/rejected");
        }
      }

      dispatch(showAwaitingTxnModal({ showAwaitingTxn: false }));
    }
  };
  const unwrap = async () => {
    dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));
    dispatch(
      setNetworkValues({
        networkFeeETH: "0.008654 ETH",
        networkFeeUSD: "~$17.35",
        txnHash: "",
      })
    );
  };
  const remix = async () => {
    dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));
    dispatch(
      setNetworkValues({
        networkFeeETH: "0.008654 ETH",
        networkFeeUSD: "~$17.35",
        txnHash: "",
      })
    );
  };

  return (
    <div className="confirm-lp-mobile-wrapper">
      {content}
      <div className="confirm-popup-footer">
        <Button
          variant="primary"
          size="lg"
          className="confirm-tx"
          onClick={() => handleButtonClick()}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ConfirmLPModal;
