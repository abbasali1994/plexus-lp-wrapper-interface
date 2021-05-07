import './index.css';


// import the images
import placeHolderX from '../../assets/images/token-selector.svg';
import selectorIcon from '../../assets/images/selector.svg';
import pair from '../../assets/images/pair.svg';

// redux
import { useDispatch, useSelector } from "react-redux";
import { showSearchModal } from "../../redux/searchTokens";

import { constants } from '../../utils';

const SelectTokenView = () => {

    return (
        <div className="select-token">
            <div className="token-selector-border">
                <div className="token-border">
                    <img src={placeHolderX} alt="selected token" width="32" height="32"/>
                </div>
            </div>
            <span className="select-token-text">
                Select a Token
                <img src={selectorIcon} alt="select icon" width="15" height="15"/>
            </span>
        </div>
    );
}

const SelectedTokenView = (props) => {

    const { tokenName, tokenSymbol } = props.token;
    let icon = null;

    try {
        icon= require(`cryptocurrency-icons/svg/color/${tokenSymbol}.svg`).default;
    }
    catch (e) {
        icon= require(`cryptocurrency-icons/svg/color/generic.svg`).default;
    }

    return (
        <div className="select-token">
            <div className="token-selector-border">
                <div className="token-border">
                    <img src={icon} alt="selected token" width="32" height="32"/>
                </div>
            </div>
            <div className="selected-token">
                <span className="selected-token-name">
                    {tokenName}
                </span>
                <br/>
                <span className="selected-token-symbol">
                    {tokenSymbol}
                    <img src={selectorIcon} alt="select icon" width="15" height="15"/>
                </span>
            </div>
        </div>
    );

}


const SetInputToken = () => {
    const { inputToken } = useSelector((state) => state.searchTokens);
    return <SelectedTokenView token={inputToken}/>
}

const SetLPToken1 = () => {
    const { lpToken1 } = useSelector((state) => state.searchTokens);
    return <SelectedTokenView token={lpToken1}/>
}

const SetLPToken2 = () => {
    const { lpToken2 } = useSelector((state) => state.searchTokens);
    return <SelectedTokenView token={lpToken2}/>
}

const InputTokenView = () => {

    const { inputToken } = useSelector((state) => state.searchTokens);
    const dispatch = useDispatch();

    return (
        <>
            <div onClick={() => dispatch(showSearchModal({showSearch:true, searchCaller: constants.inputToken}))}>
                { inputToken === null ?  <SelectTokenView/> : <SetInputToken/>}
            </div>

          
        </>
      
    );

}

const LPTokenView = () => {
   
    const { lpToken1, lpToken2 } = useSelector((state) => state.searchTokens);
    const dispatch = useDispatch();

    return (
        <>
            <div className="lp-token1" onClick={() => dispatch(showSearchModal({showSearch:true, searchCaller: constants.lpToken1}))}>
                { lpToken1 === null  ?  <SelectTokenView/> : <SetLPToken1/>}
            </div>
            <img className="pair-icon" src={pair} width="13" height="37" alt="pair"/>
            <div className="lp-token2"  onClick={() => dispatch(showSearchModal({showSearch:true, searchCaller: constants.lpToken2}))}>
                { lpToken2 === null  ?  <SelectTokenView/> : <SetLPToken2/>}
            </div>
        </>
       
    );

}

const TokenSelector = (props) => {
    const { viewType } = props;

    let element = null;

    if (viewType === 1) {
        element = <InputTokenView/>;
    }
    if (viewType === 2) {
        element = <LPTokenView/>;
    }
    
    return element;
}

export default TokenSelector;