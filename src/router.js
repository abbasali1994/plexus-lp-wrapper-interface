import Home from './views/home';
import TransactionSuccessful from './views/transaction/success';
import TransactionFailed from './views/transaction/failure';
import Dashboard from './views/dashboard';
import Unwrap from './views/unwrap';
import Remix from './views/remix';
// import ComingSoon from './components/coming-soon';

const routes = {
  "/": () => <Home />,
  "/success": () => <TransactionSuccessful/>,
  "/rejected": () => <TransactionFailed/>,
  "/dashboard*": () => <Dashboard/>,
  "/unwrap": () => <Unwrap />,
  "/remix": () => <Remix />
};

export default routes;