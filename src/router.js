import Home from './views/home';
import TransactionSuccessful from './views/transaction/success';
import Dashboard from './views/dashboard';
import Unwrap from './views/unwrap';
import Remix from './views/remix';
import ComingSoon from './components/coming-soon';
const routes = {
  "/": () => <Home />,
  "/success": () => <TransactionSuccessful/>,
  "/dashboard*": () => (false ? <Dashboard/> : <ComingSoon/>),
  "/unwrap": () => <Unwrap />,
  "/remix": () => <Remix />
};

export default routes;