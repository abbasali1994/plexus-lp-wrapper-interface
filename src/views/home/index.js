import { Row } from 'react-bootstrap';

// the other components
import Sidebar from '../../components/sidebar';
import GenerateLP from '../../components/generate';
import Copyright from '../../components/copyright';

// Utils
import { tokenViewTypes } from '../../utils';

const HomeView = () => {
  
    return (
        <div className="main-section">
            <Row>
                <Sidebar viewType={tokenViewTypes.mainInterface}/>
                <GenerateLP/>
            </Row>
            <Copyright/>
        </div>
    );
};

export default HomeView;