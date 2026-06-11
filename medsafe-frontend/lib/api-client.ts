import axios from 'axios';
import type { BackendResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const backendAPI = {
  /**
   * Send interaction prediction request to the backend
   */
  async predictInteraction(
    drugSmiles: string,
    foodSmiles: string,
    clinicalText: string
  ): Promise<BackendResponse> {
    try {
      const response = await apiClient.post<BackendResponse>('/api/predict', {
        drug_smiles: drugSmiles,
        food_smiles: foodSmiles,
        clinical_text: clinicalText,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
          error.message ||
          'Failed to fetch prediction from backend'
      );
    }
  },
};

export default apiClient;
