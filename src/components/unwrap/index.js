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

const UnwrapLPComponent = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const { selectedDex } = useSelector((state) => state.dexes);
  const { showConfirm } = useSelector((state) => state.transactions);
  const { lpTokens } = useSelector((state) => state.wallet);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });

  let children = <UnwrapLPContent lpTokenPairs={lpTokens[selectedDex]} />;
  if (!lpTokens[selectedDex] || lpTokens[selectedDex].length === 0)
    children =
      width < constants.width.mobile ? (
        <MobileLpTokensUnavailable lpTokenPairs={lpTokens[selectedDex]} />
      ) : (
        <DesktopLpTokensUnavailable lpTokenPairs={lpTokens[selectedDex]} />
      );

  if (width < constants.width.mobile) {
    if (showConfirm) children = <MobileLPWrapper />;
  }
  return (
    <Col lg="9" className="main-wrapper">
      {children}
    </Col>
  );
};

const UnwrapLPContent = ({ lpTokenPairs }) => {
  const { selectedLpTokenPair } = useSelector((state) => state.tokens);

  if (selectedLpTokenPair !== null) return <SelectedLpToken />;
  else return <SelectLpToken lpTokenPairs={lpTokenPairs} />;
};

export default UnwrapLPComponent;
