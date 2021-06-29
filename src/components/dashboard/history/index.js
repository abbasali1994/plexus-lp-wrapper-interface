import './index.scss';

// React Bootstrap
import { Col } from 'react-bootstrap';

// Dashboard Header
import DashboardHeader from "../header";

const DashboardHistoryComponent = () => {

    return (
        <Col lg="11" className="main-dashboard-wrapper">
            <DashboardHeader/>
            <div className="main-wrapper-interface">
               
            </div> 
        </Col>
    );
};

export default DashboardHistoryComponent;