import './index.css';
import { Col } from 'react-bootstrap';

// the other components
import TokenSelector from '../token-selector';
import TransactionButton from '../transaction-button';

// token view types
import { tokenViewTypes } from '../../utils';

// redux
import { useSelector } from "react-redux";

const GenerateLPComponent = () => {
    const { dexes, selectedDex } = useSelector((state) => state.dexes);
    const dexName = dexes[selectedDex].name;
    
    return (
        <Col lg="9" className="main-wrapper">
            <div className="main-wrapper-header main-header-text">
                Generate {dexName} LP Tokens     
            </div>
            <div className="main-wrapper-interface">
                <div className="input-token-section">
                    <div className="token-label">Input Token Amount</div>
                    <TokenSelector viewType={tokenViewTypes.inputToken}/>
                </div>
                <div className="select-token-pair-section">
                    <TokenSelector viewType={tokenViewTypes.selectLPPair}/>
                </div>
                <div className="input-btn">
                    <TransactionButton viewType={tokenViewTypes.inputButton} />
                </div>
            </div> 
        </Col>
    );
};

export default GenerateLPComponent;