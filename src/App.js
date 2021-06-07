import './App.css';

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

const App = () => {

  const routesResult = useRoutes(routes);

  return (
    <Container fluid className="App">

        {/*Render the Popups first */}
        <SearchTokensModal/>
        <ConfirmLPModal/>
        <AwaitingTxnModal/>

      <div className="app-wrapper">
        <Header/>
        <div className="app-views">
          {/*Render all the routes */}
          { routesResult }
        </div>
      </div>
    </Container>
  );
}

export default App;
