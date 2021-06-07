import './index.css';

// bootstrap
import { Modal } from 'react-bootstrap';

// redux
import { useDispatch, useSelector } from "react-redux";
import { showAwaitingTxnModal } from "../../../redux/transactions";

// images
import spinner from '../../../assets/gifs/confirmation.gif';

// navigate
import { navigate } from 'hookrouter';

const AwaitingTxnsModal = () => {

    const { showAwaitingTxn } = useSelector((state) => state.transactions);
    const { lpToken1, lpToken2, totalLPTokens } = useSelector((state) => state.tokens);
    const { dexes, selectedDex } = useSelector((state) => state.dexes);
    const dexName = dexes[selectedDex].name;
    let txnDesc = '';


    // if none of the LP Tokens is selected and the modal is supposed to be visible, then simulate a blockchain txn
    if (lpToken1 !== null && lpToken2 !== null && showAwaitingTxn){
        txnDesc = `Generating ${totalLPTokens} ${lpToken1.tokenSymbol.toUpperCase()}/${lpToken2.tokenSymbol.toUpperCase()} ${dexName} LP Tokens`;

        // TODO: this is just a placeholdeer action for now, it should be replaced with a real web3 txn
        const timeoutId  = setTimeout(() => {
            dispatch(showAwaitingTxnModal({showAwaitingTxn: false}));
            navigate('/success');
            clearTimeout(timeoutId);
        }, 6000);

    }

    const dispatch = useDispatch();

    return (
        <Modal 
            show={showAwaitingTxn} 
            backdrop="static"
            keyboard={false}
            animation={true}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="awaiting-txn"
            >
            <Modal.Header closeButton className="awaiting-txn-header">
                <Modal.Title>{}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <div className="awaiting-txn-body">
                    <div className="awaiting-txn-text">
                        Awaiting Confirmation 
                    </div>
                    <img className="spinner" src={spinner} alt="spinner" width="144" height="144"/>
                    <div className="awaiting-txn-desc">
                        {txnDesc}
                    </div>
                    <div className="awaiting-txn-confirm">
                        Confirm this transaction in your wallet
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AwaitingTxnsModal;