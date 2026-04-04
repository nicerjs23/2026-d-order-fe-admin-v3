import { useEffect, useState, useCallback } from "react";
import {
  CouponService,
  CouponDetail as CouponDetailType,
  CouponCode,
} from "@services/CouponService";

export const useCouponDetail = (couponId: number) => {
  const [detail, setDetail] = useState<CouponDetailType | null>(null);
  const [codes, setCodes] = useState<CouponCode[]>([]);

  const fetchDetail = useCallback(async () => {
    const res = await CouponService.getCouponDetail(couponId);
    setDetail(res.data.coupon);
    setCodes(res.data.codes);
  }, [couponId]);

  useEffect(() => {
    fetchDetail();
  }, []);

  return { detail, codes, refetch: fetchDetail };
};
