import { useSelector } from "react-redux";
import Dexes, { MobileDexes } from "../../dex-buttons";
import NothingToSee from "../../nothing-to-see";

export const DesktopLpTokensUnavailable = () => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  return (
    <>
      <div className="main-wrapper-header ">
        <span className="main-header-text">Remix LP Tokens</span>
        <span className="unwrap-dex">
          Your <span className="dex-name">{dexName}</span> LP Tokens
          <span className="unwrap-dex-btns">
            <Dexes />
          </span>
        </span>
      </div>
      <div className="main-wrapper-interface">
        <NothingToSee />
      </div>
    </>
  );
};

export const MobileLpTokensUnavailable = () => {
  return (
    <div className="main-wrapper-interface">
      <div className="input-token-section">
        <div className="token-label">Select LP Tokens to Remix</div>
        <MobileDexes />
        <NothingToSee />
      </div>
    </div>
  );
};
