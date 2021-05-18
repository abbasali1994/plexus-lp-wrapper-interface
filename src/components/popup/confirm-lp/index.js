import './index.css';

// bootstrap
import { Modal, Button } from 'react-bootstrap';

// redux
import { useDispatch, useSelector } from "react-redux";
import { showConfirmModal } from "../../../redux/transactions";

// constants
import { tokenViewTypes } from '../../../utils/token';

// token selector component
import TokenSelector from '../../token-selector';

// arrow
import arrowDown from '../../../assets/images/arrow-down.svg';

// constants
import { constants } from '../../../utils';


const ConfirmLPModal = () => {

    const { showConfirm } = useSelector((state) => state.transactions);
    const { dexes, selectedDex } = useSelector((state) => state.dexes);

    const dexName = dexes[selectedDex].name;

    const bottomSectionClass = dexName === constants.dexSushi ? "bottom-sushi-section" : "bottom-uni-section";


    const { 
      inputToken, 
      inputTokenValue, 
      inputTokenValueUSD,
      lpToken1,
      lpToken2,
      lpToken1Value,
      lpToken2Value,
      lpToken1ValueUSD,
      lpToken2ValueUSD,
      totalLPTokens
    } = useSelector((state) => state.searchTokens);

    // the input token prop
    const token = {};
    Object.assign(token, inputToken);
    token.tokenAmount = inputTokenValue;
    token.tokenAmountUSD = inputTokenValueUSD;


    // the input token prop
    const token1 = {};
    const token2 = {};
    let lpTokens = {};
    Object.assign(token1, lpToken1);
    Object.assign(token2, lpToken2);

    token1.tokenAmount = lpToken1Value;
    token1.tokenAmountUSD = lpToken1ValueUSD;

    token2.tokenAmount = lpToken2Value;
    token2.tokenAmountUSD = lpToken2ValueUSD;

    lpTokens = {token1, token2, dexName};

    const dispatch = useDispatch();

    return (
      <>
        <Modal 
            show={showConfirm} 
            onHide={() => dispatch(showConfirmModal(false))} 
            backdrop="static"
            keyboard={false}
            animation={false}>

            <Modal.Header closeButton>
              <Modal.Title>Confirm LP Generation</Modal.Title>
            </Modal.Header>
              <Modal.Body className="confirm-popup-body">
                <div className="top-section">
                  <div className="popup-content">
                    <div className="popup-header">
                      Supplying
                    </div>
                    <div className="supply-details">
                      <TokenSelector viewType={tokenViewTypes.supplyingLP} token={token}/>
                    </div>
                  </div>
                </div>
                <img className="down-arrow" src={arrowDown} alt="down arrow" width="46" height="50"/>
                <div className={bottomSectionClass}>
                  <div className="popup-content">
                    <div className="popup-header">
                      Generating
                    </div>
                    <div className="generate-lp-details">
                      <TokenSelector viewType={tokenViewTypes.generatingLP} lpTokens={lpTokens}/>
                    </div>
                    <div className="lp-token-stats">
                      <div className="lp-token-amount">
                        {totalLPTokens}
                      </div>
                      <div className="lp-token-value">
                        {lpToken1Value}
                      </div>
                      <div className="lp-token-value">
                        {lpToken2Value}
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="popup-footer">
                <Button variant="primary" size="lg" block className="confirm-tx">
                  Confirm
                </Button>
              </Modal.Footer>
        </Modal>
      </>
    );
}

export default ConfirmLPModal;