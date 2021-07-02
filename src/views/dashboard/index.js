import { useRoutes, navigate } from "hookrouter";
import { useState, useEffect } from "react";
import { Row,Col } from "react-bootstrap";

// the  components
import Sidebar from "../../components/sidebar";
import DashboardPairs from "../../components/dashboard/pairs";
import DashboardTokens from "../../components/dashboard/tokens";
import DashboardHistory from "../../components/dashboard/history";
import DashboardMainComponent from "../../components/dashboard/main";
import Copyright from "../../components/copyright";
// Dashboard Header
import DashboardHeader from "../../components/dashboard/header";
// Utils
import { tokenViewTypes, constants } from "../../utils";

const routes = {
  "/pairs": () => <DashboardPairs />,
  "/tokens": () => <DashboardTokens />,
  "/history": () => <DashboardHistory />,
};

const mobileRoutes = {
  "/": () => <DashboardMainComponent />,
};

const DashboardWrapper = () => {
  let element = null;
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  });

  element =
    width > constants.width.mobile ? <DesktopDashboard /> : <MobileDashboard />;

  return element;
};

const DesktopDashboard = () => {
  const routeResult = useRoutes(routes);

  return (
    <div>
      <Row>
        <Sidebar viewType={tokenViewTypes.dashboardInterface} />
        <Col lg="11" className="main-dashboard-wrapper">
          <DashboardHeader />
          {routeResult || navigate("/dashboard/pairs")}
        </Col>
      </Row>
      <Copyright />
    </div>
  );
};

const MobileDashboard = () => {
  const routeResult = useRoutes({ ...routes, ...mobileRoutes });

  return (
    <div className="main-section">
      <Row>
        <Sidebar viewType={tokenViewTypes.mainInterface} />
        <Col lg="9" className="main-dashboard-wrapper">
          <DashboardHeader />
        {routeResult}
        </Col>
      </Row>
      <Copyright />
    </div>
  );
};

export default DashboardWrapper;
