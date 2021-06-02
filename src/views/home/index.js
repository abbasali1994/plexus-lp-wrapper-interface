import { Row } from 'react-bootstrap';

// the other components
import Sidebar from '../../components/sidebar';
import GenerateLP from '../../components/generate';
import Copyright from '../../components/copyright';

const HomeView = () => {
  
    return (
        <div className="main-section">
            <Row>
                <Sidebar/>
                <GenerateLP/>
            </Row>
            <Copyright/>
        </div>
    );
};

export default HomeView;