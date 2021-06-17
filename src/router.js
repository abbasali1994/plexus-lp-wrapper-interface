import Home from './views/home';
import TransactionSuccessful from './views/transaction/success';
import Dashboard from './views/dashboard';
import SkeletonWrapper from './components/skeleton-wrapper';
import { DashBoardImages, MainPageImages, TransactionImages } from './utils/imageList';
const routes = {
  "/": () => <SkeletonWrapper images={MainPageImages} children={<Home/>}/>,
  "/success": () => <SkeletonWrapper images={TransactionImages} children={<TransactionSuccessful/>}/>,
  "/dashboard*": () => <SkeletonWrapper images={DashBoardImages} children={<Dashboard/>}/>
};

export default routes;