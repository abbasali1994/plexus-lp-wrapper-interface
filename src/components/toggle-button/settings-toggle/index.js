import "./index.scss";
import ToggleButton from "react-toggle-button";
import day from "../../../assets/images/toggle-open.svg"
import night from "../../../assets/images/toggle-close.svg"
const SettingsToggle = ({ value, handleChange }) => {
  var style = document.body.getElementsByClassName("App")[0].classList
  return (
    <div className="setings-toggle">
      <ToggleButton
        inactiveLabel={""}
        activeLabel={""}
        colors={{
          activeThumb: {
            base: style.contains("light")?"#f3f4f6":"#62B0E5",
          },
          inactiveThumb: {
            base: style.contains("light")?"#6b7280":"#0E1726",
          },
          active: {
            base: style.contains("light")?"#ffffff":"#050818",
          },
          inactive: {
            base: style.contains("light")?"#ffffff":"#050818",
          },
        }}
        thumbAnimateRange={[5, 30]}
        thumbIcon={value?<img src={day} width="15" alt="yes"/>:<img src={night} width="15" alt="no"/>}
        thumbStyle={{width:25,height:25,alignItems:"inherit",justifyContent:"center"}}
        trackStyle={{height:36,padding:10,width:60}}
        value={value}
        onToggle={(value) => handleChange(value)}
      />
    </div>
  );
};

export default SettingsToggle;
