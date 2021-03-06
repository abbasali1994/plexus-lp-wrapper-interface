import "./index.scss";
import { useEffect, useRef, useState } from "react";
// bootstrap
import { Modal, InputGroup, FormControl } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import { hideSearchModal, setSelectedToken } from "../../../redux/tokens";
import spinner from "../../../assets/gifs/confirmation.gif";
// get token data
import { getAllTokens, getPriceId } from "../../../utils/token";

// the tokens
const tokens = getAllTokens();

const SearchTokenWrapper = (props) => {
  const { showSearch } = useSelector((state) => state.tokens);
  if (showSearch) return <SearchTokensModal {...props}/>;
    else return "";
}

const SearchTokensModal = ({theme}) => {

  const { showSearch } = useSelector((state) => state.tokens);
  const { balances } = useSelector((state) => state.wallet);
  const { pricesUSD } = useSelector((state) => state.prices);
  const dispatch = useDispatch();
  const [searchToken, setSearchToken] = useState("");
  const [cursor, setCursor] = useState(-1);
  
  const [tokensList, setTokensList] = useState(tokens);
  const modalRef = useRef(null);

 function sortByBalance(a,b) {
  if(balances[b.symbol] && balances[a.symbol])
    return parseFloat(balances[b.symbol].balance) - parseFloat(balances[a.symbol].balance);
  return false;
 }
  
  function handleKeyDown(e) {
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      setCursor(cursor - 1);
    } else if (e.keyCode === 40 && cursor < tokensList.length - 1) {
      setCursor(cursor + 1);
    } else if (e.key === "Enter" && cursor > -1) {
      handleTokenClick(tokensList[cursor]);
      setSearchToken("");
    }
  }

  useEffect(() => {
    modalRef.current.focus();
  },[showSearch]);

  useEffect(() => {
    const searchCriteria = (token) => {
      return (
        token.name.toLowerCase().includes(searchToken.toLowerCase()) ||
        token.address.toLowerCase().includes(searchToken.toLowerCase()) ||
        token.displayName.toLowerCase().includes(searchToken.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchToken.toLowerCase())
      );
    };
    const filteredList = tokens.filter((token) => searchCriteria(token));
    if (filteredList.length) {
      setTokensList(filteredList);
      setCursor(-1);
    } else setTokensList(tokens);
  }, [searchToken]);

  const handleTokenClick = (token) => {
    let clickedToken = {};
    Object.assign(clickedToken, token);
    clickedToken.balance = balances[token.symbol].balance;
    clickedToken.tokenUSDValue = pricesUSD[getPriceId(token)].usd;

    // only update if the bal isn't null
    if(clickedToken.balance !== null) {
      clickedToken.balance = parseFloat(balances[token.symbol].balance.replace(',',''));
      dispatch(setSelectedToken(clickedToken));
      setSearchToken("");
    }
  }

  return (
    <>
      <Modal
        className={theme}
        show={true}
        onHide={() => dispatch(hideSearchModal(false))}
        backdrop="static"
        keyboard={true}
        animation={true}
        onKeyDown={handleKeyDown}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select A Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-token-body">
            <InputGroup className="mb-3">
              <FormControl
              ref={modalRef}
                value={searchToken}
                onChange={(evt) => setSearchToken(evt.target.value)}
                className="token-search-text"
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder="Enter name, symbol or address"
              />
            </InputGroup>
            <div className="token-list">
              {tokensList.sort((a, b) => sortByBalance(a, b)).map((token, i) => {
                if(!balances[token.symbol]) return "";
                return (
                  <div
                    key={token.symbol}
                    className={cursor === i ? "token-selected" : "token"}
                    onClick={() => handleTokenClick(token)}
                  >
                    <img
                      className="token-icon"
                      src={token.tokenIcon}
                      alt={token.symbol}
                      width="36"
                      height="36"
                    />
                    <span className="token-name">
                      {token.symbol.toUpperCase()}
                    </span>
                    <span className="token-bal">
                      {
                      balances[token.symbol].balance == null ?
                      <img
                      className="token-icon"
                      src={spinner}
                      alt={"loading"}
                      width="36"
                      height="36"
                    />
                    :
                    ( Number(balances[token.symbol].balance) > 0 || parseInt(balances[token.symbol].balance) > 0 ? <span className="token-bal-bold">{balances[token.symbol].balance}</span> :  balances[token.symbol].balance)
                    }
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchTokenWrapper;
