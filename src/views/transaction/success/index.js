import { Row } from 'react-bootstrap';

// the other components
import Sidebar from '../../../components/sidebar';
import TransactionSuccessful from '../../../components/transactions/success';
import Copyright from '../../../components/copyright';

const TxnDetails = () => {
  
    return (
        <div className="main-section">
            <Row>
                <Sidebar/>
                <TransactionSuccessful/>
            </Row>
            <Copyright/>
        </div>
    );
};

export default TxnDetails;