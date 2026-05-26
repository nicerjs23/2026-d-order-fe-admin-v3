// mypage/apis/resetTableData.ts
import axios, { AxiosError } from "axios";
import { instance } from "@services/instance"; // ✅ 전역 인스턴스 사용

export interface ResetTableDataResponse {
  deleted_count: number;
}

export interface ApiEnvelope<T> {
  message: string;
  data: T | null;
}

function normalizeAndThrow(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    const status = err.response?.status ?? 500;
    const body = err.response?.data;

    let message = "테이블 데이터 초기화 중 오류가 발생했습니다.";

    // 400 에러 처리: ["사용 중인 테이블이 있어 초기화할 수 없습니다."] 배열 형태 대응
    if (status === 400 && Array.isArray(body)) {
      message = body[0];
    } else if (status === 401) {
      message = "자격 인증 데이터가 제공되지 않았습니다.";
    } else if (body?.message) {
      message = body.message;
    } else if (body?.detail) {
      message = body.detail;
    }

    /* console.error("[RESET TABLE][ERROR]", { status, message }); */
    throw new Error(message);
  }

  throw new Error("알 수 없는 오류가 발생했습니다.");
}

/** * 테이블 데이터 초기화 API (DELETE /api/v3/django/booth/mypage/reset-table-data/)
 */
export async function resetTableData(): Promise<ApiEnvelope<ResetTableDataResponse>> {
  try {
    const res = await instance.delete<ApiEnvelope<ResetTableDataResponse>>(
      "/api/v3/django/booth/mypage/reset-table-data/"
    );
    return res.data;
  } catch (e) {
    normalizeAndThrow(e);
  }
}