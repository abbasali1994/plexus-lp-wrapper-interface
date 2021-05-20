import './App.css';

// The modals
import SearchTokensModal from './components/popup/token-search';
import ConfirmLPModal from './components/popup/confirm-lp';
import AwaitingTxnModal from './components/popup/awaiting-txn';

//  The components
import Header from './components/header';

// the routes
import { useRoutes } from 'hookrouter';
import routes from './router'

// Bootstrap Container
import { Container } from 'react-bootstrap';

function App() {

  const routeResult = useRoutes(routes);

  return (
    <Container fluid className="App">

      {/* We add all the modals in the HOC so that they can be rendered any where */}
        <SearchTokensModal/>
        <ConfirmLPModal />
        <AwaitingTxnModal/>
        
      <div className="app-wrapper">
        <Header/>
        <div className="app-views">
         {routeResult}
        </div>
      </div>
    </Container>
  );
}

export default App;
