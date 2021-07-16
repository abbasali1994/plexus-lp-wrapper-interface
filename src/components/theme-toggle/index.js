import "./index.scss";
import ToggleButton from "react-toggle-button";
import day from "../../assets/icons/brightness.png"
import night from "../../assets/icons/moon.png"
const ThemeToggle = ({ theme, handleChange }) => {
  return (
    <div className="theme-toggle">
      <ToggleButton
        inactiveLabel={""}
        activeLabel={""}
        colors={{
          activeThumb: {
            base: "rgb(250,250,250)",
          },
          inactiveThumb: {
            base: "rgb(62,130,247)",
          },
          active: {
            base: "rgb(207,221,245)",
            hover: "rgb(177, 191, 215)",
          },
          inactive: {
            base: "rgb(65,66,68)",
            hover: "rgb(95,96,98)",
          },
        }}
        style={{ position: "fixed" }}
        thumbAnimateRange={[-10, 36]}
        thumbIcon={theme !== "dark"?<img src={day} width="20" height="20" alt="day"/>:<img src={night} width="20" height="20" alt="night"/>}
        thumbStyle={{width:"30px",height:"30px",alignItems:"inherit",justifyContent:"center"}}
        value={theme !== "dark"}
        onToggle={(value) => handleChange(value)}
      />
    </div>
  );
};

export default ThemeToggle;
