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

// token selector component
import TokenSelector from "../../token-selector";

// arrow
import arrowDown from "../../../assets/images/arrow-down.svg";

// Utils
import { constants, tokenViewTypes } from "../../../utils";
import { wrapTokens } from "../../../utils/wallet";
import { navigate } from "hookrouter";

const ConfirmLPModal = ({ theme }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });

  let element =
    width > constants.width.mobile ? <DesktopWrapper theme={theme} /> : "";

  return element;
};

const DesktopWrapper = ({ theme }) => {

  const { showConfirm } = useSelector((state) => state.transactions);
  const { activeAction } = useSelector((state) => state.dexes);
  const { inputToken, inputTokenValue, lpToken1, lpToken2,  } = useSelector((state) => state.tokens);
  const { gasPrices } = useSelector((state) => state.prices);
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;

  const dispatch = useDispatch();

  const handleButtonClick = async() => {
    

    if (lpToken1 !== null && lpToken2 !== null && inputToken !== null && inputTokenValue !== '') {
      const res = await wrapTokens(dexName, inputToken, inputTokenValue,  lpToken1, lpToken2, gasPrices.standard);
      console.log(res);

      dispatch(showAwaitingTxnModal({ showAwaitingTxn: false }));
      //  success or failure 
      if(res){
        dispatch(setTxnStatus({ txnStatus: "success" }));
        navigate("/success")
      } else{
        dispatch(setTxnStatus({ txnStatus: "failure" })); 
        navigate("/failure");
      } 
  
    }

    dispatch(showConfirmModal({ showConfirm: false }));
    dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));
  }

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
      show={showConfirm}
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
    lpToken2ValueUSD
  } = useSelector((state) => state.tokens);

  // the input token prop
  const token = {};
  Object.assign(token, inputToken);
  token.tokenAmount = inputTokenValue + " " + token.tokenSymbol.toUpperCase();
  token.tokenAmountUSD = "~" + inputTokenValueUSDFormatted;

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

  const { outputToken } = useSelector((state) => state.tokens);

  const {
    outputTokenValue,
    outputTokenValueUSD,
    lpToken1,
    lpToken2,
    lpToken1Value,
    lpToken2Value,
    lpToken1ValueUSD,
    lpToken2ValueUSD,
    totalLPTokens,
  } = useSelector((state) => state.unwrap);

  // the input token prop
  const token = {};
  Object.assign(token, outputToken);
  token.tokenAmount = outputTokenValue;
  token.tokenAmountUSD = outputTokenValueUSD;

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
          <div className="confirm-popup-header">Unwrapping</div>
          <div className="generate-lp-details">
            <TokenSelector
              viewType={tokenViewTypes.generatingLP}
              lpTokens={lpTokens}
            />
          </div>
          <div className="lp-token-stats">
            <div className="lp-token-amount">
              {totalLPTokens} &nbsp; LP Tokens
            </div>
            <div className="lp-token-value">
              {lpToken1Value} {token1.tokenSymbol.toUpperCase()}
            </div>
            <div className="lp-token-value">
              {lpToken2Value} {token2.tokenSymbol.toUpperCase()}
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

  const { newTotalLPTokens, totalLPTokens } = useSelector(
    (state) => state.unwrap
  );

  const unwrap = useSelector((state) => state.unwrap);
  const tokens = useSelector((state) => state.tokens);

  // the input tokens prop
  const toToken1 = {};
  const toToken2 = {};
  Object.assign(toToken1, tokens.lpToken1);
  Object.assign(toToken2, tokens.lpToken2);
  toToken1.tokenAmount = tokens.lpToken1Value;
  toToken1.tokenAmountUSD = tokens.lpToken1ValueUSD;

  toToken2.tokenAmount = tokens.lpToken2Value;
  toToken2.tokenAmountUSD = tokens.lpToken2ValueUSD;
  // the unwrap token prop
  const fromToken1 = {};
  const fromToken2 = {};
  Object.assign(fromToken1, unwrap.lpToken1);
  Object.assign(fromToken2, unwrap.lpToken2);

  fromToken1.tokenAmount = unwrap.lpToken1Value;
  fromToken1.tokenAmountUSD = unwrap.lpToken1ValueUSD;

  fromToken2.tokenAmount = unwrap.lpToken2Value;
  fromToken2.tokenAmountUSD = unwrap.lpToken2ValueUSD;

  const fromLPTokens = { token1: fromToken1, token2: fromToken2, dexName };
  const toLPTokens = { token1: toToken1, token2: toToken2, dexName:newDexName };

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
              {totalLPTokens} &nbsp; LP Tokens
            </div>
            <div className="lp-token-value">
              {`${fromToken1.tokenAmount} // ${fromToken2.tokenAmount}`}
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
              {newTotalLPTokens} &nbsp; LP Tokens
            </div>
            <div className="lp-token-value">
              {`${toToken1.tokenAmount} // ${toToken2.tokenAmount}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileLPWrapper = () => {
  const { activeAction } = useSelector((state) => state.dexes);
  const { inputToken, inputTokenValue, lpToken1, lpToken2,  } = useSelector((state) => state.tokens);
  const { gasPrices } = useSelector((state) => state.prices);
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


  const handleButtonClick = async() => {
    
    console.log(lpToken1);
    console.log(lpToken2);
    console.log(inputToken);
    console.log(inputTokenValue);
    console.log(gasPrices.standard);

    if (lpToken1 !== null && lpToken2 !== null && inputToken !== null && inputTokenValue !== '') {
      const res = await wrapTokens(dexName, inputToken, inputTokenValue,  lpToken1, lpToken2, gasPrices.standard);
      console.log(res);

      dispatch(showAwaitingTxnModal({ showAwaitingTxn: false }));
      //  success or failure 
      if(res){
        dispatch(setTxnStatus({ txnStatus: "success" }));
        navigate("/success")
      } else{
        dispatch(setTxnStatus({ txnStatus: "failure" })); 
        navigate("/failure");
      } 
  
    }

    dispatch(showConfirmModal({ showConfirm: false }));
    dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));
  }

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
