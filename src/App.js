import "./App.scss";

//  The components
import Header from "./components/header";

// the routes
import { useRoutes } from "hookrouter";
import routes from "./router";

// Bootstrap Container
import { Container } from "react-bootstrap";
import { useState } from "react";
// The Modals
import SearchTokensModal from "./components/popup/token-search";
import ConfirmLPModal from "./components/popup/confirm-lp";
import AwaitingTxnModal from "./components/popup/awaiting-txn";
import HeaderWrapper from "./components/skeleton-wrapper/header";
import ThemeToggle from "./components/theme-toggle";
import SkeletonWrapper from "./components/skeleton-wrapper";
// Adds theme based on system settings on first render
const mq = window.matchMedia("(prefers-color-scheme: dark)");
if (mq.matches) {
  document.body.classList.remove("light");
  document.body.classList.add("dark");
} else {
  document.body.classList.remove("dark");
  document.body.classList.add("light");
}

const App = () => {
  const routesResult = useRoutes(routes);
  
  const [theme, setTheme] = useState(mq.matches ? "dark" : "light");
 
  const handleChange = (value) => {
    value ? setTheme("dark") : setTheme("light");
    if (value) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  };
  
  // changes theme if system settings changed
  mq.addEventListener("change", (e) => handleChange(e.matches));

  return (
    <Container fluid className={`App ${theme}`}>
      {/*Render the Popups first */}

      <SearchTokensModal theme={theme} />
      <ConfirmLPModal theme={theme} />
      <AwaitingTxnModal theme={theme} />
      <ThemeToggle handleChange={handleChange} theme={theme} />
      <div className="app-wrapper">
        <HeaderWrapper checks={["images"]} children={<Header />} />
        <div className="app-views">
          {/*Render all the routes */}
          <SkeletonWrapper
            checks={["icons", "images"]}
            children={routesResult}
          />
        </div>
      </div>
    </Container>
  );
};

export default App;
