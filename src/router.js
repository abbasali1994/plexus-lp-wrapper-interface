import Home from './views/home';
import TransactionSuccessful from './views/transaction/success';
import Dashboard from './views/dashboard';

const routes = {
  "/": () => <Home/>,
  "/success": () => <TransactionSuccessful/>,
  "/dashboard*": () => <Dashboard/>
};

export default routes;