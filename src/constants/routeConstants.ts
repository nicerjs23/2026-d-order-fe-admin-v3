export const ROUTE_PATHS = {
  INIT: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  HOME: "/home",
  TABLE_VIEW: "/table-view",
  TABLE_DETAIL: "/table-view/:tableNum",
  MYPAGE: "/mypage",
  MENU: "/menu",
  COUPON: "/coupon",
};

//근우 경로설정
export const buildTableDetailPath = (tableNum: number | string) =>
  `/table-view/${tableNum}`;