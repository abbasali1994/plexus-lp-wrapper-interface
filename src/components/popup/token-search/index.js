import './index.css';

import { Modal, Button } from 'react-bootstrap';

// redux
import { useDispatch, useSelector } from "react-redux";
import { showSearchModal } from "../../../redux/searchTokens";


const SearchTokensModal = () => {

    const { showSearch } = useSelector((state) => state.searchTokens);
   
    const dispatch = useDispatch();

    return (
      <>
        <Modal 
            show={showSearch} 
            onHide={() => dispatch(showSearchModal(false))} 
            animation={false}
            >
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => dispatch(showSearchModal(false))}>
                Close
                </Button>
                <Button variant="primary" onClick={() => dispatch(showSearchModal(false))}>
                Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
      </>
    );
}

export default SearchTokensModal;