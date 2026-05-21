// mypage/apis/getQRDownload.ts
import axios, { AxiosError } from 'axios';
import { instance } from '@services/instance'; // ✅ 전역 인스턴스 사용

/** QR 조회 응답 인터페이스 */
export interface QrResponseData {
  qr_image_url: string;
}

export interface ApiEnvelope<T> {
  message: string;
  data: T | null;
}

export interface ApiErrorBody {
  detail?: string;
  message?: string;
}

function normalizeAndThrow(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorBody>;
    const status = err.response?.status ?? 0;
    const body = err.response?.data;

    const msg =
      body?.detail ||
      body?.message ||
      (status === 401
        ? '자격 인증 데이터가 제공되지 않았습니다.'
        : status === 404
          ? 'QR 코드를 찾을 수 없습니다.'
          : 'QR 코드 조회 중 오류가 발생했습니다.');

    console.error(`[QR][${status}]`, msg);
    throw new Error(msg);
  }

  console.error('[QR] 알 수 없는 오류', error);
  throw new Error('QR 코드 처리 중 오류가 발생했습니다.');
}

/** 1) QR 이미지 URL 조회 API 호출 */
export async function getManagerQRUrl(): Promise<string> {
  try {
    const res = await instance.get<ApiEnvelope<QrResponseData>>(
      '/api/v3/django/booth/mypage/qr-download',
    );

    const url = res.data.data?.qr_image_url;
    if (!url) {
      throw new Error('QR 코드 URL이 존재하지 않습니다.');
    }
    return url;
  } catch (e) {
    normalizeAndThrow(e);
  }
}

export async function downloadManagerQRGrid(boothName: string): Promise<void> {
  const qrUrl = await getManagerQRUrl();

  const COLS = 5;
  const ROWS = 3;
  const TOTAL = COLS * ROWS;

  const logoUrl = `${window.location.origin}/images/LogoV3.png`;

  const cardHtml = Array.from({ length: TOTAL })
    .map(
      () => `
        <div class="card">
            <div class="card-top">
                <img class="logo" src="${logoUrl}" alt="D-order" />
                <span class="checkbox"></span>
            </div>
            <div class="badge">${boothName}</div>
            <div class="tagline">디오더로 주문해요!</div>
            <div class="qr-wrap">
                <img src="${qrUrl}" alt="QR" />
            </div>
        </div>
    `,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  @page { size: A4 landscape; margin: 8mm; }
  body { font-family: sans-serif; background: #fff; }
  .grid {
    display: grid;
    grid-template-columns: repeat(${COLS}, 51mm);
    grid-template-rows: repeat(${ROWS}, 60.8mm);
    column-gap: 6.5mm;
    row-gap: 5.8mm;
    margin: auto;
  }
  .card {
    background: #FF6E3F !important;
    border-radius: 10px;
    padding: 2mm 2.5mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.1mm;
  }
  .card-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo { height: 18px; width: auto; object-fit: contain; }
  .checkbox {
    width: 28px; height: 28px;
    border: 2px solid #fff;
    border-radius: 4px;
    background: #fff !important;
    flex-shrink: 0;
  }
  .badge {
    max-width: 100%;
    background: #fff !important;
    color: #000 !important;
    font-weight: 700;
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 999px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tagline {
    color: #fff !important;
    font-weight: 800;
    font-size: 12px;
  }
  .qr-wrap {
    width: 37mm;
    height: 37mm;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff !important;
    border-radius: 5.3mm;
    padding: 1mm;
    overflow: hidden;
  }
  .qr-wrap img { width: 100%; height: 100%; object-fit: contain; display: block;}
</style>
</head>
<body>
  <div class="grid">${cardHtml}</div>
  <script>
    window.addEventListener('load', () => setTimeout(() => window.print(), 300));
  </script>
</body>
</html>`;

  const popup = window.open('', '_blank', 'width=1200,height=900');
  if (!popup)
    throw new Error('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.');
  popup.document.write(html);
  popup.document.close();
}

export async function downloadManagerQR(
  filename = 'booth-qr.png',
): Promise<void> {
  try {
    // 1. URL 받아오기
    const qrUrl = await getManagerQRUrl();

    // 2. 해당 URL에서 이미지 Blob 가져오기 (CORS 문제가 없다면 fetch 사용)
    const imageRes = await fetch(qrUrl);
    if (!imageRes.ok) throw new Error('이미지를 가져오는 데 실패했습니다.');

    const blob = await imageRes.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    // 3. 브라우저 다운로드 트리거
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(objectUrl);

    console.info('[QR] 다운로드 완료:', filename);
  } catch (e: any) {
    console.error('[QR] 다운로드 실패', e);
    // URL을 직접 여는 폴백(Fallback) 처리 - CORS 이슈로 fetch가 막힐 경우 새 창에서 열기
    if (
      e.message === '이미지를 가져오는 데 실패했습니다.' ||
      e.name === 'TypeError'
    ) {
      getManagerQRUrl()
        .then((url) => {
          window.open(url, '_blank');
        })
        .catch(console.error);
    } else {
      throw e;
    }
  }
}
