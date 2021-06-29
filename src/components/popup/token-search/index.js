import "./index.scss";
import { useEffect, useRef, useState } from "react";
// bootstrap
import { Modal, InputGroup, FormControl } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import { hideSearchModal, setSelectedToken } from "../../../redux/tokens";

// get token data
import { getAllTokens } from "../../../utils/token";

// the tokens
const tokens = getAllTokens();

const SearchTokensModal = ({theme}) => {
  const { showSearch } = useSelector((state) => state.tokens);
  const dispatch = useDispatch();
  const [searchToken, setSearchToken] = useState("");
  const [cursor, setCursor] = useState(-1);
  const [tokensList, setTokensList] = useState(tokens);
  const modalRef = useRef(null);
  function handleKeyDown(e) {
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      setCursor(cursor - 1);
    } else if (e.keyCode === 40 && cursor < tokensList.length - 1) {
      setCursor(cursor + 1);
    } else if (e.key === "Enter" && cursor > -1) {
      dispatch(setSelectedToken(tokensList[cursor]));
    }
  }

  useEffect(() => {
    if (showSearch) modalRef.current.focus();
  }, [showSearch]);

  useEffect(() => {
    const searchCriteria = (token) => {
      return (
        token.tokenName.toLowerCase().includes(searchToken.toLowerCase()) ||
        token.tokenSymbol.toLowerCase().includes(searchToken.toLowerCase())
      );
    };
    const filteredList = tokens.filter((token) => searchCriteria(token));
    if (filteredList.length) {
      setTokensList(filteredList);
      setCursor(-1);
    } else setTokensList(tokens);
  }, [searchToken]);
  return (
    <>
      <Modal
        className={theme}
        show={showSearch}
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
              {tokensList.map((token, i) => {
                return (
                  <div
                    key={token.tokenSymbol}
                    className={cursor === i ? "token-selected" : "token"}
                    onClick={() => dispatch(setSelectedToken(token))}
                  >
                    <img
                      className="token-icon"
                      src={token.tokenIcon}
                      alt={token.tokenSymbol}
                      width="36"
                      height="36"
                    />
                    <span className="token-name">
                      {token.tokenSymbol.toUpperCase()}
                    </span>
                    <span className="token-bal">
                      {token.tokenBal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
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

export default SearchTokensModal;
