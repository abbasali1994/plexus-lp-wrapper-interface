import './index.css';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { useState } from 'react';

// import the images
import action from '../../assets/images/action.svg';
import dex from '../../assets/images/dex.svg';
import faq from '../../assets/images/faq.svg';

// the other components
import TokenSelector from '../token-selector';
import SearchTokensModal from '../popup/token-search';


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
const dexButtons = ["Sushiswap","Uniswap"];

const MainComponent = () => {

    const [activeActionBtn, setActiveActionBtn] = useState("Generate");
    const [selectedDex, setSelectedDex] = useState(dexButtons[0]);

    return (
      <div className="main-section">
            <Row>
                <Col lg="3" className="left-sidebar">
                    <div className="left-sidebar-wrapper">
                        <div className="left-action main-header-text">
                            ACTION
                            <img className="float-right" src={action} alt="logo" width="17" height="17"/>
                        </div>
                        <div className="left-action-buttons">
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
                        <div className="left-action-buttons">
                            <ButtonGroup className="mb-2 action-btns">
                                { 
                                    dexButtons.map(btn => (
                                        <Button key={btn} id={btn === selectedDex ? 'active-btn': ''} onClick={() => setSelectedDex(btn)}>{btn}</Button>
                                    ))
                                }
                            </ButtonGroup>
                        </div>
                        <div className="dex-stats">
                            <div className="dex-stats-header">
                                {selectedDex} stats
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
                    <SearchTokensModal/>
                    <div className="main-wrapper-header main-header-text">
                        Generate {selectedDex} LP Tokens     
                    </div>
                    <div className="main-wrapper-interface">
                        <div className="input-token-section">
                            <div className="token-label">Input Token Amount</div>
                            <TokenSelector viewType={1}/>
                        </div>
                        <div className="select-token-pair-section">
                            <div className="token-label">Select Token Pair</div>
                            <TokenSelector viewType={2}/>
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

}

export default MainComponent;