import "./index.scss";
import { Col } from "react-bootstrap";

// success
import failure from "../../../assets/gifs/failure.gif";

// redux
import { useSelector } from "react-redux";

// html parser
import ReactHtmlParser from "react-html-parser";

// txn button
import TransactionButton from "../../transaction-button";

// button view types
import { tokenViewTypes } from "../../../utils";

// navigate
import { navigate } from "hookrouter";

const TransactionFailed = () => {
  const { activeAction } = useSelector((state) => state.dexes);

  switch (activeAction) {
    case "Unwrap":
      return <UnwrapFailedWrapper />;
    case "Remix":
      return <RemixFailedWrapper />;
    default:
      return <GenerateFailedWrapper />;
  }
};
const GenerateFailedWrapper = () => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const {
    lpToken1,
    lpToken2,
    inputTokenValue,
    inputTokenValueUSD,
    totalLPTokens,
    networkFeeETH,
    networkFeeUSD,
    txnHash
  } = useSelector((state) => state.tokens);
  const space1 =
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const space3 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const space4 = "&nbsp;&nbsp;";

  let dexName = "",
    txnDesc1 = "",
    txnDesc2 = "";

  if (lpToken1 !== null && lpToken2 !== null) {
    dexName = dexes[selectedDex].name;
    txnDesc1 = `${totalLPTokens} ${lpToken1.symbol.toUpperCase()}/${lpToken2.symbol.toUpperCase()}`;
    txnDesc2 = `${dexName} LP Tokens`;
  } else {
    navigate("/");
  }

  return (
    <Col lg="9" className="main-wrapper">
      <div className="main-wrapper-header main-header-text">
        Transaction Details
      </div>
      <div className="txn-success">
        <img src={failure} alt="success" className="success-img" />
      </div>
      <div className="success-txt">failed</div>
      <div className="txn-submitted-txt">
        Your transaction has failed
      </div>
      <div className="txn-submitted-etherscan" onClick={() => window.open(`https://etherscan.io/tx/${txnHash}`, "_blank")}>View on Etherscan</div>
      <div className="txn-details">
        <div className="txn-details-line">
          <span className="txn-details-label1">
            Supply: {ReactHtmlParser(space1)}{ReactHtmlParser(space4)}{ReactHtmlParser(space4)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label2">{inputTokenValue}</span>
          <span className="txn-details-label3">
            {ReactHtmlParser(space4)}
            {inputTokenValueUSD}
          </span>
        </div>
        <div className="txn-details-line">
          <span className="txn-details-label1">
            Generate:{ReactHtmlParser(space1)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label2">
            {txnDesc1}
            {ReactHtmlParser(space4)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label3">{txnDesc2}</span>
        </div>
        <div className="txn-details-line">
          <span className="txn-details-label1">
            Network Fee:{ReactHtmlParser(space3)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label2">
            {networkFeeETH}
            {ReactHtmlParser(space4)}
          </span>
          <span className="txn-details-label3">{networkFeeUSD}</span>
        </div>
      </div>
      <div className="generate-more-btn">
        <TransactionButton viewType={tokenViewTypes.generateMoreLPsButton} />
      </div>
    </Col>
  );
};

const UnwrapFailedWrapper = () => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const {
    lpToken1,
    lpToken2,
    outputTokenValue,
    outputTokenValueUSD,
    totalLPTokens,
    networkFeeETH,
    networkFeeUSD,
  } = useSelector((state) => state.unwrap);
  const space1 =
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const space3 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const space4 = "&nbsp;&nbsp;";

  let dexName = "",
    txnDesc1 = "",
    txnDesc2 = "";

  if (lpToken1 !== null && lpToken2 !== null) {
    let newDexes = {};
    Object.assign(newDexes, dexes);
    dexName = newDexes[selectedDex].name;

    txnDesc1 = `${totalLPTokens} ${lpToken1.symbol.toUpperCase()}/${lpToken2.symbol.toUpperCase()}`;
    txnDesc2 = `${dexName} LP Tokens`;
  } else {
    navigate("/");
  }

  return (
    <Col lg="9" className="main-wrapper">
      <div className="main-wrapper-header main-header-text">
        Transaction Details
      </div>
      <div className="txn-success">
        <img src={failure} alt="success" className="success-img" />
      </div>
      <div className="success-txt">success</div>
      <div className="txn-submitted-txt">
        Your transaction has failed
      </div>
      <div className="txn-submitted-etherscan">View on Etherscan</div>
      <div className="txn-details">
        <div className="txn-details-line">
          <span className="txn-details-label1">
            Unwrap:{ReactHtmlParser(space1)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label2">
            {txnDesc1}
            {ReactHtmlParser(space4)}
          </span>
          <br className="txn-details-line-break" />
          <span className="unwrap-txn-details-label4">{txnDesc2}</span>
        </div>
        <div className="txn-details-line">
          <span className="txn-details-label1">
            Receive:{ReactHtmlParser(space1)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label2">{outputTokenValue}</span>
          <span className="txn-details-label3">
            {ReactHtmlParser(space4)}
            {outputTokenValueUSD}
          </span>
        </div>

        <div className="txn-details-line">
          <span className="txn-details-label1">
            Network Fee: {ReactHtmlParser(space3)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label2">
            {networkFeeETH}
            {ReactHtmlParser(space4)}
          </span>
          <span className="txn-details-label3">{networkFeeUSD}</span>
        </div>
      </div>
      <div className="generate-more-btn">
        <TransactionButton viewType={tokenViewTypes.unwrapMoreLPsButton} />
      </div>
    </Col>
  );
};

const RemixFailedWrapper = () => {
  const { dexes, selectedDex, newDex } = useSelector((state) => state.dexes);
  const unwrap = useSelector((state) => state.unwrap);
  const tokens = useSelector((state) => state.tokens);
  const space1 =
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const space2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const space3 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const space4 = "&nbsp;&nbsp;";

  let dexName = "",newDexName = "",
    txnDesc1 = "",
    txnDesc2 = "",
    txnDesc3 = "",
    txnDesc4 = "";

  if (unwrap.lpToken1 !== null && unwrap.lpToken2 !== null) {

    dexName = dexes[selectedDex].name;
    newDexName = dexes[newDex].name;
    txnDesc1 = `${
      unwrap.totalLPTokens
    } ${unwrap.lpToken1.symbol.toUpperCase()}/${unwrap.lpToken2.symbol.toUpperCase()}`;
    txnDesc2 = `${dexName} LP Tokens`;
    txnDesc3 = `${
      unwrap.newTotalLPTokens
    } ${tokens.lpToken1.symbol.toUpperCase()}/${tokens.lpToken2.symbol.toUpperCase()}`;
    txnDesc4 = `${newDexName} LP Tokens`;
  } else {
    navigate("/");
  }

  return (
    <Col lg="9" className="main-wrapper">
      <div className="main-wrapper-header main-header-text">
        Transaction Details
      </div>
      <div className="txn-success">
        <img src={failure} alt="success" className="success-img" />
      </div>
      <div className="success-txt">success</div>
      <div className="txn-submitted-txt">
        Your transaction has failed
      </div>
      <div className="txn-submitted-etherscan">View on Etherscan</div>
      <div className="txn-details">
        <div className="txn-details-line">
          <span className="txn-details-label1">
            Remix:{ReactHtmlParser(space1)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label2">
            {txnDesc1}
            {ReactHtmlParser(space4)}
          </span>
          <br className="txn-details-line-break" />
          <span className="unwrap-txn-details-label4">{txnDesc2}</span>
        </div>
        <div className="txn-details-line">
          <span className="txn-details-label1">
            Into:{ReactHtmlParser(space1)}{ReactHtmlParser(space2)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label2">
            {txnDesc3}
            {ReactHtmlParser(space4)}
          </span>
          <br className="txn-details-line-break" />
          <span className="unwrap-txn-details-label4">{txnDesc4}</span>
        </div>

        <div className="txn-details-line">
          <span className="txn-details-label1">
            Network Fee:{ReactHtmlParser(space3)}
          </span>
          <br className="txn-details-line-break" />
          <span className="txn-details-label2">
            {unwrap.networkFeeETH}
            {ReactHtmlParser(space4)}
          </span>
          <span className="txn-details-label3">{unwrap.networkFeeUSD}</span>
        </div>
      </div>
      <div className="generate-more-btn">
        <TransactionButton viewType={tokenViewTypes.remixMoreLPsButton} />
      </div>
    </Col>
  );
};

export default TransactionFailed;
