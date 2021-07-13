import "./index.scss";
import ToggleButton from "react-toggle-button";

const ThemeToggle = ({ theme, setTheme }) => {
  const handleChange = (value) => {
    value ? setTheme("dark") : setTheme("light")
    if (value) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }
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
        thumbAnimateRange={[0, 36]}
        value={theme !== "dark"}
        onToggle={(value) => handleChange(value)}
      />
    </div>
  );
};

export default ThemeToggle;
