import Home from './views/home';
import TransactionSuccessful from './views/transaction/success';
import Dashboard from './views/dashboard';
import Unwrap from './views/unwrap';
import Remix from './views/remix';
import SkeletonWrapper from './components/skeleton-wrapper';
const routes = {
  "/": () => <SkeletonWrapper checks={["icons","images","gifs"]} children={<Home/>}/>,
  "/success": () => <TransactionSuccessful/>,
  "/dashboard*": () => <Dashboard/>,
  "/unwrap": () => <Unwrap />,
  "/remix": () => <Remix />
};

export default routes;