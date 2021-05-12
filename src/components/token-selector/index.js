import './index.css';

import { useState } from 'react';

// bootstrap
import {  InputGroup, FormControl } from 'react-bootstrap';

// import the images
import placeHolderX from '../../assets/images/token-selector.svg';
import selectorIcon from '../../assets/images/selector.svg';
import pair from '../../assets/images/pair.svg';
import arrowUp from '../../assets/images/arrow-up.svg';

// redux
import { useDispatch, useSelector } from "react-redux";
import { showSearchModal } from "../../redux/searchTokens";

// constants
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

    const { tokenDisplayName, tokenSymbol, tokenIcon } = props.token;

    return (
        <div className="select-token">
            <div className="token-selector-border">
                <div className="token-border">
                    <img src={tokenIcon} alt="selected token" width="55" height="55"/>
                </div>
            </div>
            <div className="selected-token">
                <span className="selected-token-name">
                    {tokenDisplayName}
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
    const [inputTokenValue, setInputTokenValue] = useState('0.00');

    return (
        <div className="select-input-token">
            <div onClick={() => {
                setInputTokenValue('0.00');
                dispatch(showSearchModal({showSearch:true, searchCaller: constants.inputToken}));
            }}>
                { inputToken === null ?  <SelectTokenView/> : <SetInputToken/>}
            </div>
            <InputGroup className="mb-3">
                <FormControl
                  className="input-token-text"
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder={'0.00'}
                  disabled={inputToken === null}
                  value={inputTokenValue}
                />
                {
                    inputToken !== null 
                    ?
                    (inputToken.tokenBal > 0 ?  
                        <InputGroup.Append onClick={() => setInputTokenValue(inputToken.tokenBal + " " + inputToken.tokenSymbol.toUpperCase())}> 
                            <InputGroup.Text id="max-token">
                                max
                                <img src={arrowUp} alt="up-arrow" width="13" height="13"/>
                            </InputGroup.Text>
                        </InputGroup.Append> : null)
                    :
                    null
                }
            </InputGroup>
        </div>
    );

}

const LPTokenView = () => {
   
    const { inputToken, lpToken1, lpToken2 } = useSelector((state) => state.searchTokens);
    const dispatch = useDispatch();

    return (
        <div className={inputToken === null ? 'input-disabled' :''}>
            <div className="token-label">Select Token Pair</div>
            <div className="select-lp1-token">
                <div className="lp-token1" onClick={ inputToken === null ? null : () => dispatch(showSearchModal({showSearch:true, searchCaller: constants.lpToken1}))}>
                    { lpToken1 === null  ?  <SelectTokenView/> : <SetLPToken1/>}
                </div>
                <InputGroup className="mb-3">
                    <FormControl
                        className="input-token-text"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        placeholder="0.00"
                        disabled={true}
                    />
                </InputGroup>
            </div>
            <img className="pair-icon" src={pair} width="13" height="37" alt="pair"/>
            <div className="select-lp2-token">
                <div className="lp-token2"  onClick={ inputToken === null ? null : () => dispatch(showSearchModal({showSearch:true, searchCaller: constants.lpToken2}))}>
                    { lpToken2 === null  ?  <SelectTokenView/> : <SetLPToken2/>}
                </div>
                <InputGroup className="mb-3">
                    <FormControl
                        className="input-token-text"
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        placeholder="0.00"
                        disabled={true}
                    />
                </InputGroup>
            </div>
        </div>
       
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