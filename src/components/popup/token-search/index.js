import './index.css';

import { Modal, InputGroup, FormControl  } from 'react-bootstrap';

// redux
import { useDispatch, useSelector } from "react-redux";
import { hideSearchModal, setSelectedToken } from "../../../redux/searchTokens";


const SearchTokensModal = () => {

  // the tokens
    const tokens=[
      {tokenName:"Ethereum", tokenSymbol: "eth", tokenBal: "3.45612"},
      {tokenName:"USDCoin", tokenSymbol: "usdc", tokenBal: "0.00"}, 
      {tokenName:"Wrapped BTC", tokenSymbol: "wbtc", tokenBal:  "0.00"}, 
      {tokenName:"Badger", tokenSymbol: "badger", tokenBal:  "0.00"}, 
      {tokenName:"Aave", tokenSymbol: "aave", tokenBal:  "0.00"}, 
      {tokenName:"Sushiswap", tokenSymbol: "sushi", tokenBal:  "0.00"}, 
      {tokenName:"Uniswap", tokenSymbol: "uni", tokenBal:  "0.00"}];

    const { showSearch } = useSelector((state) => state.searchTokens);
    const dispatch = useDispatch();

    return (
      <>
        <Modal 
            show={showSearch} 
            onHide={() => dispatch(hideSearchModal(false))} 
            backdrop="static"
            keyboard={false}
            animation={false}
            >
            <Modal.Header closeButton>
                <Modal.Title>Select A Token</Modal.Title>
            </Modal.Header>
            <Modal.Body className="search-token-body">
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
                    let icon = null;

                    try {
                      icon= require(`cryptocurrency-icons/svg/color/${token.tokenSymbol}.svg`).default;
                    }
                    catch (e) {
                      icon= require(`cryptocurrency-icons/svg/color/generic.svg`).default;
                    }

                    return (
                      <div key={token.tokenSymbol} className="token" onClick={() => dispatch(setSelectedToken(token))}>
                        <img className="token-icon" src={icon} alt={token.tokenSymbol} width="36" height="36"/>
                        <span className="token-name">{token.tokenSymbol.toUpperCase()}</span>
                        <span className="token-bal">{token.tokenBal}</span>
                      </div>
                    )
                   
                  })
                }
              
              </div>
            </Modal.Body>
        </Modal>
      </>
    );
}

export default SearchTokensModal;