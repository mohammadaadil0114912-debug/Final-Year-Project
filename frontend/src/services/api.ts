import axios from 'axios';
import { TranslationResult, User, VocabularyItem, SavedPhrase, HistoryItem, EvaluationReport } from '../types';

const api = axios.create({
  baseURL: ((import.meta as any).env?.VITE_API_BASE_URL) || '/api',
  timeout: 30000,
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('asl_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiClient = {
  // Translation
  async translateText(text: string, strategy: string = 'rag_grounded'): Promise<TranslationResult> {
    const res = await api.post('/translate/text', { text, strategy });
    return res.data.data;
  },

  async translateSpeech(transcript: string, audioConfidence?: number, strategy: string = 'rag_grounded'): Promise<TranslationResult> {
    const res = await api.post('/translate/speech', { transcript, audioConfidence, strategy });
    return res.data.data;
  },

  async translateImage(file: File, strategy: string = 'rag_grounded'): Promise<{ ocr_result: any; translation: TranslationResult }> {
    const form = new FormData();
    form.append('image', file);
    form.append('strategy', strategy);
    const res = await api.post('/translate/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('asl_auth_token', res.data.token);
    }
    return res.data;
  },

  async register(email: string, password: string, name: string, preferredMode: string = 'text'): Promise<{ token: string; user: User }> {
    const res = await api.post('/auth/register', { email, password, name, preferredMode });
    if (res.data.token) {
      localStorage.setItem('asl_auth_token', res.data.token);
    }
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data.user;
  },

  async updatePreferences(prefs: Partial<User>): Promise<User> {
    const res = await api.patch('/auth/preferences', prefs);
    return res.data.user;
  },

  logout() {
    localStorage.removeItem('asl_auth_token');
  },

  // Vocabulary
  async getVocabulary(params: { category?: string; search?: string; page?: number; limit?: number } = {}) {
    const res = await api.get('/vocabulary', { params });
    return res.data;
  },

  // Phrases
  async getPhrases(): Promise<SavedPhrase[]> {
    const res = await api.get('/phrases');
    return res.data.data;
  },

  async createPhrase(data: { englishText: string; aslGloss: string; category?: string; isFavorite?: boolean }): Promise<SavedPhrase> {
    const res = await api.post('/phrases', data);
    return res.data.data;
  },

  async deletePhrase(id: string): Promise<void> {
    await api.delete(`/phrases/${id}`);
  },

  // History
  async getHistory(page: number = 1, limit: number = 20): Promise<{ data: HistoryItem[]; total: number }> {
    const res = await api.get('/history', { params: { page, limit } });
    return res.data;
  },

  async deleteHistoryItem(id: string): Promise<void> {
    await api.delete(`/history/${id}`);
  },

  async clearHistory(): Promise<void> {
    await api.delete('/history');
  },

  // Feedback
  async submitFeedback(data: { requestId?: string; inputText: string; aslGloss?: string; issueCategory: string; comments?: string }) {
    const res = await api.post('/feedback', data);
    return res.data;
  },

  // Research Evaluation
  async getEvaluation(forceFresh: boolean = false): Promise<EvaluationReport> {
    const res = await api.get('/research/evaluation', { params: { forceFresh } });
    return res.data.data;
  },

  async getResearchEvaluation(forceFresh: boolean = false): Promise<EvaluationReport> {
    return this.getEvaluation(forceFresh);
  },

  // Admin
  async getAdminVocabulary(params: any = {}) {
    const res = await api.get('/admin/vocabulary', { params });
    return res.data;
  },

  async createAdminVocabulary(entry: any) {
    const res = await api.post('/admin/vocabulary', entry);
    return res.data.data;
  },

  async updateAdminVocabulary(id: string, entry: any) {
    const res = await api.patch(`/admin/vocabulary/${id}`, entry);
    return res.data.data;
  },

  async reviewAdminVocabulary(id: string, status: string, notes?: string) {
    const res = await api.post(`/admin/vocabulary/${id}/review`, { status, notes });
    return res.data;
  }
};
