import './index.css';
import { Container } from 'react-bootstrap';

// import the various components
import Header from '../../components/header';
import Main from '../../components/main';

function Home() {
  return (
    <Container fluid className="home">
      <Header/>
      <div className="plexus-ui">
        <Main/>
      </div>
    </Container>
  );
}

export default Home;