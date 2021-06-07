import { Row } from 'react-bootstrap';

// the other components
import Sidebar from '../../../components/sidebar';
import TransactionSuccessful from '../../../components/transactions/success';
import Copyright from '../../../components/copyright';

// Utils
import { tokenViewTypes } from '../../../utils';

const TxnDetails = () => {
  
    return (
        <div className="main-section">
            <Row>
            <Sidebar viewType={tokenViewTypes.mainInterface}/>
                <TransactionSuccessful/>
            </Row>
            <Copyright/>
        </div>
    );
};

export default TxnDetails;