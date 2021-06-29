import './index.scss';

// Redux
import { useSelector } from "react-redux";

// Dex Buttons
import Dexes from '../../dex-buttons';

// React Bootstrap
import { Col, Row} from 'react-bootstrap';

// Back Arrow
import backArrow from '../../../assets/images/back-arrow.svg';

// Route Path
import { usePath } from 'hookrouter';

const DashboardHeader = () => {

    const { dexes, selectedDex } = useSelector((state) => state.dexes);
    const dexName = dexes[selectedDex].name;
    const pathName = usePath().replace("/dashboard/","");

    return (
        <Row className="dashboard-header">
            <Col className="dashboard-path" onClick={() => window.history.go(-1)}>
                <img className="back-arrow" src={backArrow} width="28" height="28" alt="back arrow"/>
                Dashboard / <span className="dashboard-path-name">{pathName}</span>
            </Col>
            <Col>
                <span className="dashboard-dex">
                    Your <span className="dex-name">{dexName}</span>  LP Tokens
                </span>
                <span className="dashboard-dex-btns">
                    <Dexes/>
                </span>
            </Col>
        </Row> 
    );
};

export default DashboardHeader;