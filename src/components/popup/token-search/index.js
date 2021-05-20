import './index.css';

// bootstrap
import { Modal, InputGroup, FormControl } from 'react-bootstrap';

// redux
import { useDispatch, useSelector } from "react-redux";
import { hideSearchModal, setSelectedToken } from "../../../redux/tokens";

// get token data
import { getAllTokens } from '../../../utils/token';

// the tokens
const tokens = getAllTokens();

const SearchTokensModal = () => {

    const { showSearch } = useSelector((state) => state.tokens);
    const dispatch = useDispatch();

    return (
      <>
        <Modal 
            show={showSearch} 
            onHide={() => dispatch(hideSearchModal(false))} 
            backdrop="static"
            keyboard={false}
            animation={true}
            >
            <Modal.Header closeButton>
                <Modal.Title>Select A Token</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="search-token-body">
                <InputGroup className="mb-3">
                  <FormControl
                  className="token-search-text"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    placeholder="Enter name, symbol or address"
                  />
                </InputGroup>
                <div className="token-list">
                  {
                    tokens.map(token => {
                      return (
                        <div key={token.tokenSymbol} className="token" onClick={() => dispatch(setSelectedToken(token))}>
                          <img className="token-icon" src={token.tokenIcon} alt={token.tokenSymbol} width="36" height="36"/>
                          <span className="token-name">{token.tokenSymbol.toUpperCase()}</span>
                          <span className="token-bal">{token.tokenBal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </Modal.Body>
        </Modal>
      </>
    );
}

export default SearchTokensModal;