import { useState, useEffect } from "react";
import "./index.scss";
import { Col } from "react-bootstrap";

import { MobileLPWrapper } from "../popup/confirm-lp";
import {
  MobileLpTokensUnavailable,
  DesktopLpTokensUnavailable,
} from "./lp-tokens-unavailable";

// token view types
import { constants } from "../../utils";
import SelectLpToken from "./select-lp-token";
import SelectedLpToken from "./selected-lp-token";
// redux
import { useSelector } from "react-redux";

const RemixLPComponent = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const { selectedDex } = useSelector((state) => state.dexes);
  const { showConfirm } = useSelector((state) => state.transactions);
  const { lpTokenPairs } = useSelector((state) => state.unwrap);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });
  let children = <RemixLPContent />;
  if (width < constants.width.mobile) {
    if (lpTokenPairs[selectedDex].length === 0)
      children = <MobileLpTokensUnavailable />;
    if (showConfirm) children = <MobileLPWrapper />;
  } else if (lpTokenPairs[selectedDex].length === 0) {
    children = <DesktopLpTokensUnavailable />;
  }

  return (
    <Col lg="9" className="main-wrapper">
      {children}
    </Col>
  );
};

const RemixLPContent = () => {
  const { selectedDex } = useSelector((state) => state.dexes);
  const { selectedLpTokenPair, lpTokenPairs } = useSelector(
    (state) => state.unwrap
  );

  if (selectedLpTokenPair !== null) return <SelectedLpToken />;
  else return <SelectLpToken lpTokenPairs={lpTokenPairs[selectedDex]} />;
};

export default RemixLPComponent;
