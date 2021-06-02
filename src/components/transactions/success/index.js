import './index.css';
import { Col } from 'react-bootstrap';

// success
import success from '../../../assets/gifs/success.gif';

// redux
import { useSelector } from "react-redux";

import ReactHtmlParser from 'react-html-parser'; 

// txn button

const TransactionSuccessful = () => {

    const { 
            lpToken1, 
            lpToken2, 
            inputTokenValue, 
            inputTokenValueUSD,
            totalLPTokens,
            networkFeeETH,
            networkFeeUSD
        } = useSelector((state) => state.tokens);

    const { dexes, selectedDex } = useSelector((state) => state.dexes);
    const dexName = dexes[selectedDex].name;

    const space1 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    const space2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    const space3 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    const space4 = "&nbsp;&nbsp;";

    const txnDesc1 = `${totalLPTokens} ${lpToken1.tokenSymbol.toUpperCase()}/${lpToken2.tokenSymbol.toUpperCase()}`;
    const txnDesc2 = `${dexName} LP Tokens`;

    return (
        <Col lg="9" className="main-wrapper">
            <div className="main-wrapper-header main-header-text">
                Transaction Details 
            </div>
            <div className="txn-success">
                <img src={success} alt="success" width="146" height="146"/>
            </div>
            <div className="success-txt">
                success
            </div>
            <div className="txn-submitted-txt">
                Your transaction has been submitted
            </div>
            <div className="txn-submitted-etherscan">
                View on etherscan
            </div>
            <div className="txn-details">
                <div className="txn-details-line">
                    <span className="txn-details-label1">Supplied: {ReactHtmlParser(space1)}</span>
                    <span className="txn-details-label2">{inputTokenValue}</span>
                    <span className="txn-details-label3">{ReactHtmlParser(space4)}{inputTokenValueUSD}</span>
                </div>
                <div className="txn-details-line">
                    <span className="txn-details-label1">Generated: {ReactHtmlParser(space2)}</span>
                    <span className="txn-details-label2">{txnDesc1}</span>
                    <span className="txn-details-label3">{ReactHtmlParser(space4)}{txnDesc2}</span>
                </div>
                <div className="txn-details-line">
                    <span className="txn-details-label1">Network Fee:{ReactHtmlParser(space3)}</span>
                    <span className="txn-details-label2">{networkFeeETH}</span>
                    <span className="txn-details-label3">{ReactHtmlParser(space4)}{networkFeeUSD}</span>
                </div>
            </div>
        </Col>
    );
};

export default TransactionSuccessful;