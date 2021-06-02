import './index.css';

import { Button } from 'react-bootstrap';

// redux
import { useDispatch, useSelector } from "react-redux";
import { showConfirmModal } from "../../redux/transactions";

// this component is responsible for handling all the blockchain txn's in the app
const Transaction = () => {

    const { inputToken, lpToken1, lpToken2, inputTokenValue, lpToken1Value, lpToken2Value } = useSelector((state) => state.tokens);
    const allTokensNotSelected = inputToken === null || lpToken1 === null || lpToken2 === null;
    const allTokenValuesNotSet = inputTokenValue === "" || lpToken1Value === "" || lpToken2Value === "";
    const disableBtn = allTokensNotSelected || allTokenValuesNotSet;

    let btnText = disableBtn ? allTokensNotSelected ? "Input Amount & Select Tokens": "Input Amount" : "Confirm LP Generation";

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

export default Transaction;