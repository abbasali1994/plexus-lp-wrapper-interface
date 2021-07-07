import { useState, useEffect } from "react";
import "./index.scss";

// bootstrap
import { Modal, Button } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  showConfirmModal,
  showAwaitingTxnModal,
} from "../../../redux/transactions";

// token selector component
import TokenSelector from "../../token-selector";

// arrow
import arrowDown from "../../../assets/images/arrow-down.svg";

// Utils
import { constants, tokenViewTypes } from "../../../utils";

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
  const { activeAction } = useSelector((state) => state.dexes);
  const { showConfirm } = useSelector((state) => state.transactions);
  const dispatch = useDispatch();
  let content = "";
  switch (activeAction) {
    case "Unwrap":
      content = <ModalUnwrapLPWrapper />;
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
          onClick={() => {
            dispatch(showConfirmModal({ showConfirm: false }));
            dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
const ModalConfirmLPWrapper = ({ theme }) => {
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
    inputTokenValueUSD,
    lpToken1,
    lpToken2,
    lpToken1Value,
    lpToken2Value,
    lpToken1ValueUSD,
    lpToken2ValueUSD,
    totalLPTokens,
  } = useSelector((state) => state.tokens);

  // the input token prop
  const token = {};
  Object.assign(token, inputToken);
  token.tokenAmount = inputTokenValue;
  token.tokenAmountUSD = inputTokenValueUSD;

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
            <div className="lp-token-amount">
              {totalLPTokens} &nbsp; LP Tokens
            </div>
            <div className="lp-token-value">{lpToken1Value}</div>
            <div className="lp-token-value">{lpToken2Value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalUnwrapLPWrapper = ({ theme }) => {
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
            <div className="unwrap-lp-token-amount">
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

export const MobileLPWrapper = () => {
  const { activeAction } = useSelector((state) => state.dexes);
  const dispatch = useDispatch();
  let content = "";
  switch (activeAction) {
    case "Unwrap":
      content = <UnwrapLPContent />;
      break;

    default:
      content = <ConfirmLPContent />;
  }
  return (
    <div className="confirm-lp-mobile-wrapper">
      {content}
      <div className="confirm-popup-footer">
        <Button
          variant="primary"
          size="lg"
          className="confirm-tx"
          onClick={() => {
            dispatch(showConfirmModal({ showConfirm: false }));
            dispatch(showAwaitingTxnModal({ showAwaitingTxn: true }));
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ConfirmLPModal;
