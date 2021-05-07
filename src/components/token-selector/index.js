import './index.css';

import { useState } from 'react';

// import the images
import placeHolderX from '../../assets/images/token-selector.svg';
import selectorIcon from '../../assets/images/selector.svg';

// redux
import { useDispatch } from "react-redux";
import { showSearchModal } from "../../redux/searchTokens";


const SingleTokenView = (props) => {

    const dispatch = useDispatch();

    return (
        <div className="select-token" onClick={() => dispatch(showSearchModal(true))}>
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
      
    )

}

const DoubleTokenView = () => {
   

    return (
        <div className="token-selector" >
            <img className="selected-token" src={placeHolderX} alt="logo" width="57" height="57"/>
        </div>
    )

}


const TokenSelector = (props) => {
    const { viewType } = props;
    return viewType === 1 ? <SingleTokenView/> : <DoubleTokenView/>
}

export default TokenSelector;