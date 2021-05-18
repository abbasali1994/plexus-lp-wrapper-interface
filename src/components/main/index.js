import './index.css';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { useState } from 'react';

// import the images
import action from '../../assets/images/action.svg';
import dex from '../../assets/images/dex.svg';
import faq from '../../assets/images/faq.svg';

// the other components
import TokenSelector from '../token-selector';
import Transaction from '../transaction-button';
import Dexes from '../dex';

// redux
import { useSelector } from "react-redux";

// token view types
import { tokenViewTypes } from '../../utils/token';

// constants
import { constants } from '../../utils';

const dexStats = [{
    dexStatKey: "Protocol Liquidity",
    dexStatValue: "$4.241b"
},
{
    dexStatKey: "Number of Pairs",
    dexStatValue: "942"
},
{
    dexStatKey: "Number of Tokens",
    dexStatValue: "736"
}];

const actionButtons = ["Generate","Unwrap","Remix"];

const MainComponent = () => {

    const [activeActionBtn, setActiveActionBtn] = useState("Generate");
    const { dexes, selectedDex } = useSelector((state) => state.dexes);
    const dexName = dexes[selectedDex].name;

    const bg = dexName === constants.dexSushi ? "left-sidebar-sushi" : "left-sidebar-uni";

    return (
      <div className="main-section">
            <Row>
                <Col lg="3" className={bg}>
                    <div className="left-sidebar-wrapper">
                        <div className="left-action main-header-text">
                            ACTION
                            <img className="float-right" src={action} alt="logo" width="17" height="17"/>
                        </div>
                        <div>
                            <ButtonGroup className="mb-2 action-btns">
                                { 
                                    actionButtons.map(btn => (
                                        <Button key={btn} id={btn === activeActionBtn ? 'active-btn': ''} onClick={() => setActiveActionBtn(btn)}>{btn}</Button>
                                    ))
                                }
                            </ButtonGroup>
                        </div>
                        <div className="left-action main-header-text">
                            DEX
                            <img className="float-right" src={dex} alt="logo" width="17" height="17"/>
                        </div>
                        {/* The dex buttons */}
                        <Dexes/>
                        <div className="dex-stats">
                            <div className="dex-stats-header">
                                {dexes[selectedDex].name} stats
                            </div>
                            {
                                dexStats.map(dex => (
                                    <span key={dex.dexStatKey}>
                                        <div className="dex-stats-key">
                                            {dex.dexStatKey}
                                        </div>
                                        <div className="dex-stats-value">
                                            {dex.dexStatValue}
                                        </div>
                                    </span>
                                ))
                            }
                        </div>
                        <div className="faq">
                            <img className="float-left" src={faq} alt="logo" width="25" height="25"/>
                            FAQ 
                        </div>
                    </div>
                </Col>
                <Col lg="9" className="main-wrapper">
                    <div className="main-wrapper-header main-header-text">
                        Generate {dexes[selectedDex].name} LP Tokens     
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
                            <Transaction/>
                        </div>
                    </div>
                    
                </Col>
            
            </Row>
            <Row>
                <Col lg="12" className="copyright">
                    Copyright © 2021 PLEXUS, All rights reserved.
                </Col>
            </Row>
      </div>
    );
};

export default MainComponent;