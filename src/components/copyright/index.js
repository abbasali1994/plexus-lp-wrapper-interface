import './index.scss';
import { Row, Col } from 'react-bootstrap';

const CopyrightComponent = () => {
    return (
        <Row>
            <Col lg="12" className="copyright">
                Copyright © 2021 PLEXUS, All rights reserved.
            </Col>
        </Row>
    );
}

export default CopyrightComponent;