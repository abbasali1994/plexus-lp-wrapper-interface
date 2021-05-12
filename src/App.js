import './App.css';

// Header component
import Header from './components/header';

// The modals
import SearchTokensModal from './components/popup/token-search';

// Other Views
import Home from './views/home';

import { Container } from 'react-bootstrap';

function App() {
  return (
    <Container fluid className="App">
      <Header/>

      {/* We add all the modals in the HOC so that they can be rendered any where */}
      <SearchTokensModal/>
      <div className="app-views">
        <Home/>
      </div>
    </Container>
  );
}

export default App;
