import './index.css';

import { Button } from 'react-bootstrap';

// redux
import { useSelector } from "react-redux";

// this component is responsible for handling all the blockchain txn's in the app
const Transaction = () => {

    const { inputToken, lpToken1, lpToken2, inputTokenValue, lpToken1Value, lpToken2Value } = useSelector((state) => state.searchTokens);
    const allTokensNotSelected = inputToken === null || lpToken1 === null || lpToken2 === null;
    const allTokenValuesNotSet = inputTokenValue === "" || lpToken1Value === "" || lpToken2Value === "";
    const disableBtn = allTokensNotSelected || allTokenValuesNotSet;

    let btnText = disableBtn ? allTokensNotSelected ? "Input Amount & Select Tokens": "Input Amount" : "Confirm LP Generation";
    
    return (
        <Button variant="primary" size="lg" block className="input-amount" disabled={disableBtn}>
           {btnText}
        </Button>
    );
}

export default Transaction;