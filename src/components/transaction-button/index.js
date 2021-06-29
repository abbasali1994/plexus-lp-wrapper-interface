import './index.scss';

import { Button } from 'react-bootstrap';

// redux
import { useDispatch, useSelector } from "react-redux";
import { showConfirmModal } from "../../redux/transactions";
import { resetState } from "../../redux/tokens";

// button view types
import { tokenViewTypes } from '../../utils';

// this component is responsible for handling all the blockchain txn's in the app
const InputButton = () => {

    const { inputToken, lpToken1, lpToken2, inputTokenValue, lpToken1Value, lpToken2Value } = useSelector((state) => state.tokens);
    const allTokensNotSelected = inputToken === null || lpToken1 === null || lpToken2 === null;
    const allTokenValuesNotSet = inputTokenValue === "" || lpToken1Value === "" || lpToken2Value === "";
    const disableBtn = allTokensNotSelected || allTokenValuesNotSet;

    let btnText = disableBtn ? allTokensNotSelected ? "Input Amount & Select Tokens": "Input Amount" : "Review Transaction";

    const dispatch = useDispatch();
    
    return (
        disableBtn ?
        <Button variant="primary" size="lg" block className="input-amount" disabled={disableBtn}  >
            {btnText}
        </Button>
         :
        <Button variant="primary" size="lg" block className="input-amount confirm-lp" disabled={disableBtn}  onClick={() => dispatch(showConfirmModal({ showConfirm: true } ))} >
            {btnText}
        </Button>
    );
}

const GenerateMoreLPS = () => {
    const dispatch = useDispatch();
    return (
        <Button variant="primary" size="lg" block className="input-amount confirm-lp" onClick={()=>{
            // clear the global state
            dispatch(resetState());
        }} >
            Generate New LP Tokens
        </Button>
    )
}

const Transaction = ({ viewType }) => {

    let element = null;

    if (viewType === tokenViewTypes.inputButton) {
        element = <InputButton/>
    }

    if (viewType === tokenViewTypes.generateMoreLPsButton) {
        element = <GenerateMoreLPS/>
    }

    return element;
}

export default Transaction;