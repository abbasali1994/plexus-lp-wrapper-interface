import './index.css';
import { Col, ButtonGroup, Button } from 'react-bootstrap';
import { useState } from 'react';

// import the images
import action from '../../assets/images/action.svg';
import dex from '../../assets/images/dex.svg';
import faq from '../../assets/images/faq.svg';
import pair from '../../assets/images/dashboard-pair.svg';
import token from '../../assets/images/dashboard-token.svg';
import history from '../../assets/images/dashboard-history.svg';

// constants
import { constants, tokenViewTypes } from '../../utils';

// Dex Buttons
import Dexes from '../dex-buttons';

// Redux
import { useSelector } from "react-redux";

// Routing
import { navigate } from 'hookrouter';
import { usePath } from 'hookrouter';


const DashboardSideBarComponent = () => {

    const pathName = usePath();
    const [activeDashboardPath] = useState(pathName);
    const paths = [ { icon:pair, name: '/dashboard/pairs' },
                    { icon:token, name: '/dashboard/tokens'  },
                    { icon:history, name: '/dashboard/history'  }];
    return (
        <Col lg="1" className="dashboard-sidebar">
            <div className="dashboard-icons">
                {
                    paths.map(path => (
                        <div key={path.name} 
                             className="dashboard-icon"
                             id={path.name === activeDashboardPath ? 'active-path': ''}
                             onClick={()=>{
                                 navigate(path.name);
                             }}>
                            <div className="dashboard-icon-background">
                                <img src={path.icon} width="22" height="22" alt="pair icon"/>
                            </div>
                        </div>
                    ))
                }
            
            </div>
            <div className="faq1">
                <img className="float-left" src={faq} alt="logo" width="25" height="25"/>
                FAQ 
            </div>
        </Col>
    );

}

const MainSideBarComponent = () => {

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

    const [activeActionBtn, setActiveActionBtn] = useState("Generate");
    const { dexes, selectedDex } = useSelector((state) => state.dexes);
    const dexName = dexes[selectedDex].name;

    const bg = dexName === constants.dexSushi ? "left-sidebar-sushi" : "left-sidebar-uni";
    return (
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
    )
};

const SideBarComponent = ({viewType}) =>{

    let element = null;

    if(viewType === tokenViewTypes.dashboardInterface) {
        element = <DashboardSideBarComponent/>
    }

    if(viewType === tokenViewTypes.mainInterface) {
        element = <MainSideBarComponent/>
    }


    return element;
    
}

export default SideBarComponent;