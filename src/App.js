import './App.css';

// Header component
import Header from './components/header';

// The modals
import SearchTokensModal from './components/popup/token-search';
import ConfirmLPModal from './components/popup/confirm-lp';

// Other Views
import Home from './views/home';

import { Container } from 'react-bootstrap';

function App() {
  return (
    <Container fluid className="App">
      <div className="app-wrapper">
        <Header/>
        {/* We add all the modals in the HOC so that they can be rendered any where */}
        <SearchTokensModal/>
        <ConfirmLPModal />
        <div className="app-views">
          <Home/>
        </div>
      </div>
    </Container>
  );
}

export default App;
