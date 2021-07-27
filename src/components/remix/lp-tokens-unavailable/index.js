import { useSelector } from "react-redux";
import Dexes, { MobileDexes } from "../../dex-buttons";
import Loading from "../../loading";
import NothingToSee from "../../nothing-to-see";

export const DesktopLpTokensUnavailable = ({lpTokenPairs}) => {
  const { dexes, selectedDex } = useSelector((state) => state.dexes);
  const dexName = dexes[selectedDex].name;
  return (
    <>
      <div className="main-wrapper-header">
        <span className="main-header-text">Remix LP Tokens</span>
        <span className="remix-dex">
          Your <span className="dex-name">{dexName}</span> LP Tokens
          <span className="remix-dex-btns">
            <Dexes />
          </span>
        </span>
      </div>
      <div className="main-wrapper-interface">
      {lpTokenPairs ? <NothingToSee /> : <Loading />}
      </div>
    </>
  );
};

export const MobileLpTokensUnavailable = ({lpTokenPairs}) => {
  return (
    <div className="main-wrapper-interface">
      <div className="input-token-section">
        <div className="token-label">Select LP Tokens to Remix</div>
        <MobileDexes />
        {lpTokenPairs ? <NothingToSee /> : <Loading />}
      </div>
    </div>
  );
};
