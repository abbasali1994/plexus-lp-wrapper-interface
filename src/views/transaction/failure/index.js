import { Row } from 'react-bootstrap';

// the other components
import Sidebar from '../../../components/sidebar';
import Copyright from '../../../components/copyright';

// Utils
import { tokenViewTypes } from '../../../utils';
import TransactionFailed from '../../../components/transactions/failure';

const TxnDetails = () => {
  
    return (
        <div className="main-section">
            <Row>
            <Sidebar viewType={tokenViewTypes.mainInterface}/>
                <TransactionFailed/>
            </Row>
            <Copyright/>
        </div>
    );
};

export default TxnDetails;