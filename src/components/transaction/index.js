import './index.css';

import { Button } from 'react-bootstrap';

// redux
import { useSelector } from "react-redux";

// this component is responsible for handling all the blockchain txn's in the app
const Transaction = () => {

    const { inputToken, lpToken1, lpToken2 } = useSelector((state) => state.searchTokens);
    const disableBtn = inputToken === null && lpToken1 === null && lpToken2 === null;
    
    return (
        <Button variant="primary" size="lg" block className="input-amount" disabled={disableBtn}>
            Input Amount & Select Tokens
        </Button>
    );
}

export default Transaction;