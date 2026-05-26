    // mypage/apis/logout.ts
    import axios, { AxiosError } from "axios";
    import { instance } from "@services/instance"; // ✅ 전역 인스턴스 사용

    export interface ApiEnvelope<T = null> {
    message: string;
    data?: T | null;
    }

    function normalizeAndThrow(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const err = error as AxiosError<any>;
        const status = err.response?.status ?? 500;
        const body = err.response?.data;

        const message =
        body?.message ||
        (status === 400
            ? "이미 로그아웃된 상태이거나 잘못된 요청입니다."
            : status === 401
            ? "자격 인증 데이터가 제공되지 않았습니다."
            : "로그아웃에 실패했습니다.");

        /* console.error("[LOGOUT][ERROR]", { status, message }); */
        throw { message, data: null };
    }
    
    throw { message: "로그아웃에 실패했습니다.", data: null };
    }

    /** 로그아웃: DELETE /api/v3/django/auth/ */
    export async function requestLogout(): Promise<ApiEnvelope> {
    try {
        const res = await instance.delete<ApiEnvelope>("/api/v3/django/auth/");
        return res.data;
    } catch (e) {
        normalizeAndThrow(e);
    }
    }