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

const App = () => {
  const routesResult = useRoutes(routes);
  const [theme, setTheme] = useState("dark");

  return (
    <Container fluid className={`App ${theme}`}>
      {/*Render the Popups first */}

      <SearchTokensModal theme={theme} />
      <ConfirmLPModal theme={theme} />
      <AwaitingTxnModal theme={theme} />
      <div className="theme-toggle">
        <ThemeToggle setTheme={setTheme} theme={theme} />
      </div>
      <div className="app-wrapper">
        <HeaderWrapper checks={["images"]} children={<Header />} />
        <div className="app-views">
          {/*Render all the routes */}
          {routesResult}
        </div>
      </div>
    </Container>
  );
};

export default App;
