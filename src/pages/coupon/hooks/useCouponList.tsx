import { useState, useEffect } from "react";
import { CouponService, Coupon } from "@services/CouponService";

export const useCouponList = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const fetchCoupons = async () => {
    try {
      const response = await CouponService.getCouponList();
      setCoupons(response.data);
    } catch {
      /* console.error("쿠폰 불러오기 실패"); */
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return { coupons, refetch: fetchCoupons };
};
