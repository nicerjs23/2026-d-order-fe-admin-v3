import { instance } from './instance';

export interface BoothNameResponse {
  message: string;
  data: { booth_name: string };
}

const BoothService = {
  // GET /api/v3/django/booth/name/ — 쿠키 인증, booth_id 불필요
  getBoothName: async (): Promise<BoothNameResponse> => {
    const response = await instance.get<BoothNameResponse>(
      '/api/v3/django/booth/name/',
    );
    return response.data;
  },
};

export default BoothService;
