import { instance } from './instance';

export interface postNewCouponRequest {
  name: string;
  description: string;
  discount_type: 'AMOUNT' | 'RATE';
  discount_value: number;
  quantity: number;
}
// V3 쿠폰 등록 응답 형식
export interface postNewCouponResponse {
  message: string;
  data: {
    coupon: {
      coupon_id: number;
      booth_id: number;
      name: string;
      description: string | null;
      discount_type: 'AMOUNT' | 'RATE';
      discount_value: number;
      quantity: number;
      created_at: string;
    };
  };
}
// V3 쿠폰 목록 응답: coupon_name→name, discount_type 대문자, is_used 제거
export interface Coupon {
  coupon_id: number;
  name: string;
  discount_type: 'AMOUNT' | 'RATE';
  discount_value: number;
  created_at: string;
  total_count: number;
  remaining_count: number;
}

export interface getCouponListResponse {
  status: string;
  code: number;
  data: Coupon[];
}

// V3 쿠폰 상세 정보
export interface CouponDetail {
  coupon_id: number;
  name: string;
  description: string | null;
  discount_type: 'RATE' | 'AMOUNT';
  discount_value: number;
  display_discount_value: number;
  quantity: number;
  used_count: number;
  unused_count: number;
  created_at: string;
}

// V3 쿠폰 코드
export interface CouponCode {
  coupon_code_id: number;
  code: string;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
}

export interface getCouponDetailResponse {
  message: string;
  data: {
    coupon: CouponDetail;
    codes: CouponCode[];
  };
}

export interface deleteCouponResponse {
  status: string;
  code: number;
  message: string;
}

export const CouponService = {
  // V3: POST /api/v3/django/coupon/
  postNewCoupon: async (
    data: postNewCouponRequest,
  ): Promise<postNewCouponResponse> => {
    const response = await instance.post<postNewCouponResponse>(
      '/api/v3/django/coupon/',
      data,
    );
    return response.data;
  },

  // V3: GET /api/v3/django/coupon/
  getCouponList: async (): Promise<getCouponListResponse> => {
    try {
      const response = await instance.get<getCouponListResponse>(
        '/api/v3/django/coupon/',
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // V3: GET /api/v3/django/coupon/{coupon_id}/detail/
  getCouponDetail: async (
    coupon_id: number,
  ): Promise<getCouponDetailResponse> => {
    try {
      const response = await instance.get<getCouponDetailResponse>(
        `/api/v3/django/coupon/${coupon_id}/detail/`,
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // V3: DELETE /api/v3/django/coupon/<coupon_id>/
  deleteCoupon: async (coupon_id: number): Promise<deleteCouponResponse> => {
    try {
      const response = await instance.delete<deleteCouponResponse>(
        `/api/v3/django/coupon/${coupon_id}/`,
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // V3: GET /api/v3/django/coupon/download/?coupon_id=<coupon_id>
  getDownCouponExcel: async (coupon_id: number) => {
    const res = await instance.get(`/api/v3/django/coupon/download/`, {
      params: { coupon_id },
      responseType: 'blob',
    });

    const getTodayString = () => {
      const now = new Date();
      return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
        2,
        '0',
      )}${String(now.getDate()).padStart(2, '0')}`;
    };

    const cd = res.headers['content-disposition'] || '';
    const m =
      cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i) ||
      cd.match(/filename="?([^";]+)"?/i);

    let filename = `coupons_${coupon_id}_${getTodayString()}.xlsx`;
    if (m?.[1]) {
      try {
        filename = decodeURIComponent(m[1]);
      } catch {
        filename = m[1];
      }
    }

    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
