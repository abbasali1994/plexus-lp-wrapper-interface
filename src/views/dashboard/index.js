
import { useRoutes, navigate } from 'hookrouter';

import { Row } from 'react-bootstrap';

// the  components
import Sidebar from '../../components/sidebar';
import DashboardPairs from '../../components/dashboard/pairs';
import DashboardTokens from '../../components/dashboard/tokens';
import DashboardHistory from '../../components/dashboard/tokens';
import Copyright from '../../components/copyright';

// Utils
import { tokenViewTypes } from '../../utils';

const routes = {
    '/pairs': () => <DashboardPairs/>,
    '/tokens': () => <DashboardTokens/>,
    '/history': () => <DashboardHistory/>,
};

const Dashboard = () => {

    const routeResult = useRoutes(routes);
    
    return (
        <div>
            <Row>
                <Sidebar viewType={tokenViewTypes.dashboardInterface}/>
                {routeResult || navigate('/dashboard/pairs')}
            </Row>
            <Copyright/>
        </div>
    );
};


export default Dashboard