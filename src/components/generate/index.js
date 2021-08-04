import { useState, useEffect } from "react";
import './index.scss';
import { Col } from 'react-bootstrap';

// the other components
import TokenSelector from '../token-selector';
import TransactionButton from '../transaction-button';

// token view types
import { constants, tokenViewTypes } from '../../utils';

// redux
import { useSelector } from "react-redux";
import { MobileLPWrapper } from "../popup/confirm-lp";
import TransactionSettings, { MobileTransactionSettingsWrapper, TransactionSettingsMobileButton } from "../transaction-settings";

const GenerateLPComponent = (props) => {
    const [width, setWidth] = useState(window.innerWidth);
    const { showConfirm, showTransactionSettings } = useSelector((state) => state.transactions);
    useEffect(() => {
      function handleResize() {
        setWidth(window.innerWidth);
      }
      window.addEventListener("resize", handleResize);
    });
  
  let children = <GenerateLPContent {...props}/>
  if(width < constants.width.mobile){
    if(showConfirm) children=<MobileLPWrapper />;
    else if(showTransactionSettings) children=<MobileTransactionSettingsWrapper />;
  }
    
  
  return <Col lg="9" className="main-wrapper">{children}</Col>;
};

const GenerateLPContent = (props) => {
    const { dexes, selectedDex } = useSelector((state) => state.dexes);
    const dexName = dexes[selectedDex].name;
    return (
    <>
            <div className="main-wrapper-header main-header-text">
                Generate {dexName} LP Tokens     
                <TransactionSettings {...props}/>
            </div>
            <div className="main-wrapper-interface">
                <div className="input-token-section">
                    <div className="token-label">Input Token Amount</div>
                    <div className="txn-settings-mobile-btn"><TransactionSettingsMobileButton /></div>
                    <TokenSelector viewType={tokenViewTypes.inputToken}/>
                </div>
                <div className="select-token-pair-section">
                     <TokenSelector viewType={tokenViewTypes.selectLPPair}/>
                </div>
                <div className="input-btn">
                    <TransactionButton viewType={tokenViewTypes.inputButton} />
                </div>
            </div> 
    </>
    );
};

export default GenerateLPComponent;