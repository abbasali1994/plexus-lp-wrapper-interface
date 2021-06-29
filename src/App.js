import './App.scss';

//  The components
import Header from './components/header';

// the routes
import { useRoutes } from 'hookrouter';
import routes from './router'

// Bootstrap Container
import { Container } from 'react-bootstrap';

// The Modals
import SearchTokensModal from './components/popup/token-search';
import ConfirmLPModal from './components/popup/confirm-lp';
import AwaitingTxnModal from './components/popup/awaiting-txn';
import HeaderWrapper from './components/skeleton-wrapper/header';

const App = () => {

  const routesResult = useRoutes(routes);
  const theme = "dark"
  
  return (
    <Container fluid className={`App ${theme}`}>

        {/*Render the Popups first */}
        <SearchTokensModal theme={theme}/>
        <ConfirmLPModal theme={theme}/>
        <AwaitingTxnModal theme={theme}/>

      <div className="app-wrapper">
        <HeaderWrapper checks={["images"]} children={<Header/>}/>
        <div className="app-views">
          {/*Render all the routes */}
          { routesResult }
        </div>
      </div>
    </Container>
  );
}

export default App;
