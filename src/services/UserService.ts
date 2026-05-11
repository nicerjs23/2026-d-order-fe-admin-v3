import { isAxiosError } from 'axios';
import { instance } from './instance';

/** v3: POST /api/v3/django/auth/signup/ - 부스 관리자 계정 생성 */
export interface SignupRequestV3 {
  username: string;
  password: string;
  booth_data: {
    name: string;
    table_max_cnt: number;
    account: number;
    depositor: string;
    bank: string;
    seat_type: 'PT' | 'PP' | 'NO';
    seat_fee_person: number;
    seat_fee_table: number;
    table_limit_hours: number;
  };
}

export interface SignupResponseV3 {
  message: string;
  data: { username: string; booth_id: number };
  /** 회원가입 직후 로그인 처리 시 토큰을 내려주는 경우 */
  token?: { access: string; refresh?: string };
}

/** 오류 시 서버 응답 (필드별 메시지 배열) */
export interface SignupErrorDataV3 {
  username?: string[];
  booth_data?: {
    seat_type?: string[];
    name?: string[];
    table_max_cnt?: string[];
    account?: string[];
    depositor?: string[];
    bank?: string[];
    seat_fee_person?: string[];
    seat_fee_table?: string[];
    table_limit_hours?: string[];
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

/** v3: POST /api/v3/django/auth/ - 운영자 로그인 */
export interface LoginResponseV3 {
  message: string;
  data: {
    username: string;
    booth_id: number;
  };
  token?: { access: string; refresh?: string };
}

/** v3: POST /api/v3/django/auth/refresh/ - JWT 토큰 재발급 (인증 불필요, refresh 토큰으로 요청) */
export interface RefreshRequestV3 {
  refresh: string;
}

/** refresh 200: JSON에 access 없이 message/data만 오고 쿠키로 갱신되는 경우 허용 */
export interface RefreshResponseV3 {
  message?: string;
  data?: { username?: string; booth_id?: number };
  access?: string;
  refresh?: string;
}

const UserService = {
  /** v3: POST /api/v3/django/auth/signup/ - 부스 관리자 계정 생성 */
  postSignupV3: async (data: SignupRequestV3): Promise<SignupResponseV3> => {
    const response = await instance.post<SignupResponseV3>(
      '/api/v3/django/auth/signup/',
      data,
    );
    if (
      !response.data?.data?.username ||
      response.data?.data?.booth_id == null
    ) {
      throw new Error('회원가입 응답이 올바르지 않습니다.');
    }
    return response.data;
  },

  /** v3: POST /api/v3/django/auth/ - 운영자 로그인 */
  loginV3: async (data: LoginRequest): Promise<LoginResponseV3> => {
    const response = await instance.post<LoginResponseV3>(
      '/api/v3/django/auth/',
      data,
    );
    if (
      !response.data?.data?.username ||
      response.data?.data?.booth_id == null
    ) {
      throw new Error('로그인 응답이 올바르지 않습니다.');
    }
    return response.data;
  },

  /** v3: POST /api/v3/django/auth/refresh/ - Access 재발급(쿠키) 또는 유효 시 message만 */
  refreshTokenV3: async (refreshToken?: string): Promise<RefreshResponseV3> => {
    const body = refreshToken != null ? { refresh: refreshToken } satisfies RefreshRequestV3 : {};
    console.info('[V3 Refresh] POST /api/v3/django/auth/refresh/ 토큰 재발급 시도');
    try {
      const response = await instance.post<RefreshResponseV3>(
        '/api/v3/django/auth/refresh/',
        body,
      );
      const d = response.data;
      if (typeof d?.access === 'string' && d.access) {
        localStorage.setItem('accessToken', d.access);
      }
      if (
        d &&
        (typeof d.message === 'string' ||
          d.data != null ||
          (typeof d.access === 'string' && d.access.length > 0))
      ) {
        console.info('[V3 Refresh] 성공', {
          message: d.message,
          data: d.data,
          accessInBody: Boolean(
            typeof d.access === 'string' && d.access.length > 0,
          ),
        });
        return d;
      }
      console.warn(
        '[V3 Refresh] 응답 형식 이상 (message/data/access 없음)',
        d,
      );
      throw new Error('토큰 재발급 응답이 올바르지 않습니다.');
    } catch (err) {
      if (isAxiosError(err)) {
        console.warn('[V3 Refresh] 실패', {
          status: err.response?.status,
          data: err.response?.data,
        });
      } else {
        console.warn('[V3 Refresh] 실패', err);
      }
      throw err;
    }
  },
};

export default UserService;
