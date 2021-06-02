import Home from './views/home';
import TransactionSuccessful from './views/transaction/success';

const routes = {
  "/": () => <Home/>,
  "/success": () => <TransactionSuccessful/>
};

export default routes;