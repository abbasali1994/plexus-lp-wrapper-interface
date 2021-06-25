import './index.css';
import { Col } from 'react-bootstrap';

// success
import success from '../../../assets/gifs/success.gif';

// redux
import { useSelector } from "react-redux";

// html parser
import ReactHtmlParser from 'react-html-parser'; 

// txn button
import TransactionButton from '../../transaction-button';

// button view types
import { tokenViewTypes } from '../../../utils';

// navigate
import { navigate } from 'hookrouter';

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
  

    const space1 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    const space2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    const space3 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    const space4 = "&nbsp;&nbsp;";

    let dexName = "", txnDesc1 = "", txnDesc2 = "";

    if (lpToken1 !== null && lpToken2 !== null) {
    
        let newDexes = {};
        Object.assign(newDexes, dexes);
        dexName = newDexes[selectedDex].name;

        txnDesc1 = `${totalLPTokens} ${lpToken1.tokenSymbol.toUpperCase()}/${lpToken2.tokenSymbol.toUpperCase()}`;
        txnDesc2 = `${dexName} LP Tokens`;
    } else {
        navigate('/');
    }

   
    return (
        <Col lg="9" className="main-wrapper">
            <div className="main-wrapper-header main-header-text">
                Transaction Details 
            </div>
            <div className="txn-success">
                <img src={success} alt="success" className="success-img"/>
            </div>
            <div className="success-txt">
                success
            </div>
            <div className="txn-submitted-txt">
                Your transaction has been submitted
            </div>
            <div className="txn-submitted-etherscan">
                View on Etherscan
            </div>
            <div className="txn-details">
                <div className="txn-details-line">
                    <span className="txn-details-label1">Supplied: {ReactHtmlParser(space1)}</span>
                    <br className="txn-details-line-break" />
                    <span className="txn-details-label2">{inputTokenValue}</span>
                    <span className="txn-details-label3">{ReactHtmlParser(space4)}{inputTokenValueUSD}</span>
                </div>
                <div className="txn-details-line">
                    <span className="txn-details-label1">Generated: {ReactHtmlParser(space2)}</span>
                    <br className="txn-details-line-break" />
                    <span className="txn-details-label2">{txnDesc1}{ReactHtmlParser(space4)}</span>
                    <br className="txn-details-line-break" />
                    <span className="txn-details-label3">{txnDesc2}</span>
                </div>
                <div className="txn-details-line">
                    <span className="txn-details-label1">Network Fee:{ReactHtmlParser(space3)}</span>
                    <br className="txn-details-line-break" />
                    <span className="txn-details-label2">{networkFeeETH}{ReactHtmlParser(space4)}</span>
                    <span className="txn-details-label3">{networkFeeUSD}</span>
                </div>
            </div>
            <div className="generate-more-btn">
                <TransactionButton viewType={tokenViewTypes.generateMoreLPsButton} />
            </div>
        </Col>
    );
};

export default TransactionSuccessful;