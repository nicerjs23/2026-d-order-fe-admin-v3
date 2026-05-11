import { createBrowserRouter } from 'react-router-dom';

//GA훅 추가
import { useGoogleAnalytics } from '@hooks/useGoogleAnalytics';

// components
import DefaultLayout from '@components/layout/DefaultLayout';
import UserLayout from '@components/layout/UserLayout';

// pages
import InitPage from '@pages/init/InitPage';
import LoginPage from '@pages/login/LoginPage';
import SignupPage from '@pages/signup/SignupPage';
import TableViewPage from '@pages/tableView/TableViewPage';
import MyPage from '@pages/mypage/MyPage';
import MenuPage from '@pages/menu/MenuPage';
import CouponPage from '@pages/coupon/CouponPage';
import { ROUTE_PATHS } from '@constants/routeConstants';
import OrderListPage from '@pages/orderlistpage/OrderListPage';
import TableDetailPage from '@pages/tableView/TableDetailPage';

// GA 추적을 위한 래퍼 컴포넌트
const LayoutWithAnalytics = ({ children }: { children: React.ReactNode }) => {
  useGoogleAnalytics(); // Router 컨텍스트 내부에서 사용
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    element: (
      <LayoutWithAnalytics>
        <DefaultLayout />
      </LayoutWithAnalytics>
    ),
    children: [
      { path: ROUTE_PATHS.HOME, element: <OrderListPage /> },
      { path: ROUTE_PATHS.TABLE_VIEW, element: <TableViewPage /> },
      { path: ROUTE_PATHS.TABLE_DETAIL, element: <TableDetailPage /> },
      { path: ROUTE_PATHS.MYPAGE, element: <MyPage /> },
      { path: ROUTE_PATHS.MENU, element: <MenuPage /> },
      { path: ROUTE_PATHS.COUPON, element: <CouponPage /> },
    ],
  },
  {
    element: (
      <LayoutWithAnalytics>
        <UserLayout />
      </LayoutWithAnalytics>
    ),
    children: [
      { path: ROUTE_PATHS.INIT, element: <InitPage /> },
      { path: ROUTE_PATHS.LOGIN, element: <LoginPage /> },
      { path: ROUTE_PATHS.SIGNUP, element: <SignupPage /> },
    ],
  },
]);

export default router;
