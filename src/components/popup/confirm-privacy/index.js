import "./index.scss";

// bootstrap
import { Modal, Button, Row, Col } from "react-bootstrap";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  showConfirmModal,
  showConfirmPrivacyModal,
} from "../../../redux/transactions";

import SettingsToggle from "../../toggle-button/settings-toggle";
import { useState } from "react";

const ConfirmPrivacyWrapper = (props) => {
  const { showConfirmPrivacy } = useSelector((state) => state.transactions);
  if (showConfirmPrivacy) return <ConfirmPrivacyModal {...props} />;
  else return "";
};

const ConfirmPrivacyModal = ({ theme }) => {
  const [value, setValue] = useState(true);
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    dispatch(showConfirmPrivacyModal({ showConfirmPrivacy: false }));
    dispatch(showConfirmModal({ showConfirm: true }));
  };
  return (
    <Modal
      show={true}
      backdrop="static"
      onHide={() =>
        dispatch(showConfirmPrivacyModal({ showConfirmPrivacy: false }))
      }
      keyboard={false}
      animation={true}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={`${theme} awaiting-txn`}
    >
      <Modal.Header closeButton className="awaiting-txn-header">
        <Modal.Title>{}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="confirm-privacy-body">
          <div className="confirm-privacy-text">
            This transaction will move the market, and can be front-run or
            sandwhich attacked.
          </div>

          <div className="confirm-privacy-qn">
            Would you like to make this transaction private to prevent this?
          </div>
          <Row className="confirm-privacy-toggle">
            <Col className={!value ? "confirm-privacy-toggle-active" : ""}>No</Col>
            <Col>
              <SettingsToggle
                value={value}
                handleChange={(value) => setValue(!value)}
              />
            </Col>
            <Col className={value ? "confirm-privacy-toggle-active" : ""}>Yes</Col>
          </Row>
          <Button
            variant="primary"
            size="lg"
            className="confirm-privacy-btn"
            onClick={() => handleButtonClick()}
          >
            Submit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmPrivacyWrapper;
