import "./index.scss";
import {
  Col,
  Dropdown,
  FormControl,
  InputGroup,
  Row,
  Button,
} from "react-bootstrap";
import gear from "../../assets/images/gear.svg";
import close from "../../assets/images/close.svg";
import React, { useState } from "react";
import SettingsToggle from "../toggle-button/settings-toggle";
import { useDispatch } from "react-redux";
import { showTransactionSettings } from "../../redux/transactions";

// The forwardRef is important!!

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ style, className, "aria-labelledby": labeledBy }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <TransactionSettingsContent />
      </div>
    );
  }
);
const TransactionSettings = () => {
  return (
    <Dropdown className="txn-settings">
      <Dropdown.Toggle className="txn-settings-btn">
        <img src={gear} alt="settings" />
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu} className="txn-settings-menu" alignRight />
    </Dropdown>
  );
};

const TransactionSettingsContent = () => {
  const [deadline, setDeadline] = useState(true);
  const [multihops, setMultiHops] = useState(false);
  const [shield, setShield] = useState(false);
  const [txnDeadline, setTxnDeadline] = useState();
  const dispatch = useDispatch();

  const handleTxnDeadlineChange = (value) => {
    if (/^\d*$/.test(value)) {
      setTxnDeadline(value);
    }
  };
  return (
    <div>
      <h1 className="txn-settings-menu-header">
        Transaction settings{" "}
        <Button
          variant="transparent"
          className="txn-settings-close"
          onClick={() =>
            dispatch(
              showTransactionSettings({ showTransactionSettings: false })
            )
          }
        >
          {" "}
          <img src={close} alt="close" />
        </Button>
      </h1>
      <div className="txn-settings-label">Slippage Tollerance</div>
      <InputGroup className="mb-3">
        <FormControl
          className="txn-settings-input"
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          placeholder={"0.5%"}
          disabled
        />
        <InputGroup.Append onClick={() => {}}>
          <InputGroup.Text id="auto-token">
            Auto
           
          </InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>

      <div className="txn-settings-label">Transaction Deadline</div>
      <InputGroup className="mb-3">
        <FormControl
          className="txn-settings-input"
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          placeholder={30}
          value={txnDeadline}
          disabled={!deadline}
          onChange={(evt) => handleTxnDeadlineChange(evt.target.value)}
        />
        <div className="txn-deadline-text">MINUTES</div>
      </InputGroup>
      <h1 className="txn-settings-menu-header">Interface settings</h1>
      <Row>
        <Col lg={9} xs={8} className="txn-settings-label">
          Transaction Deadline
        </Col>
        <Col className="txn-setings-toggle">
          <SettingsToggle
            value={deadline}
            handleChange={(value) => setDeadline(!value)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={9} xs={8} className="txn-settings-label">
          Disable Multihops
        </Col>
        <Col className="txn-setings-toggle">
          <SettingsToggle
            value={multihops}
            handleChange={(value) => setMultiHops(!value)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={9} xs={8} className="txn-settings-label">
          MEV Shield by Archer DAO
        </Col>
        <Col className="txn-setings-toggle">
          <SettingsToggle
            value={shield}
            handleChange={(value) => setShield(!value)}
          />
        </Col>
      </Row>
    </div>
  );
};

export const TransactionSettingsMobileButton = () => {
  const dispatch = useDispatch();
  return (
    <Button
      className="txn-settings txn-settings-btn"
      onClick={() =>
        dispatch(showTransactionSettings({ showTransactionSettings: true }))
      }
    >
      <img src={gear} alt="settings" />
    </Button>
  );
};

export const MobileTransactionSettingsWrapper = () => {
  const dispatch = useDispatch();
  let content = <TransactionSettingsContent />;

  const handleButtonClick = () => {
    dispatch(showTransactionSettings({ showTransactionSettings: false }));
  };

  return (
    <div className="txn-settings-mobile-wrapper">
      {content}
      <div className="confirm-popup-footer">
        <Button
          variant="primary"
          size="lg"
          className="confirm-tx"
          onClick={() => handleButtonClick()}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default TransactionSettings;
