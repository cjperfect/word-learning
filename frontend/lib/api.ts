import axios from 'axios';
import { VocabEntry, VocabGrouped } from './types';

const API_BASE = 'http://localhost:3001';

// 标准响应格式
interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

export const vocabApi = {
  create: async (content: string): Promise<VocabEntry> => {
    const response = await axios.post<ApiResponse<VocabEntry>>(`${API_BASE}/vocab/create`, { content });
    return response.data.data;
  },

  list: async (): Promise<VocabGrouped> => {
    const response = await axios.get<ApiResponse<VocabGrouped>>(`${API_BASE}/vocab/list`);
    return response.data.data;
  },

  analyze: async (id: string): Promise<VocabEntry> => {
    const response = await axios.post<ApiResponse<VocabEntry>>(`${API_BASE}/vocab/analyze/${id}`);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await axios.delete<ApiResponse<void>>(`${API_BASE}/vocab/${id}`);
    return response.data.data;
  },
};
