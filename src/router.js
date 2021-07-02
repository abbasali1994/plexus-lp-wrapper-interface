import Home from './views/home';
import TransactionSuccessful from './views/transaction/success';
import Dashboard from './views/dashboard';
import SkeletonWrapper from './components/skeleton-wrapper';
const routes = {
  "/": () => <SkeletonWrapper checks={["icons","images","gifs"]} children={<Home/>}/>,
  "/success": () => <SkeletonWrapper checks={["icons","images","gifs"]} children={<TransactionSuccessful/>}/>,
  "/dashboard*": () => <Dashboard/>
};

export default routes;