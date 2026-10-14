import axios from 'axios';
import FormData from 'form-data';
import { config } from '../config/index.js';

const client = axios.create({
  baseURL: config.aiServiceUrl,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
});

export const aiClient = {
  async checkHealth() {
    try {
      const res = await client.get('/ai/health');
      return res.data;
    } catch (e: any) {
      return { status: 'offline', error: e.message };
    }
  },

  async translateText(text: string, strategy: string = 'rag_grounded') {
    const res = await client.post('/ai/translate/text', {
      text,
      strategy,
      include_diagnostics: true,
    });
    return res.data;
  },

  async translateTranscript(transcript: string, audioConfidence?: number, strategy: string = 'rag_grounded') {
    const res = await client.post('/ai/translate/transcript', {
      transcript,
      audio_confidence: audioConfidence,
      strategy,
    });
    return res.data;
  },

  async translateImage(fileBuffer: Buffer, filename: string, mimetype: string, strategy: string = 'rag_grounded') {
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename,
      contentType: mimetype,
    });
    form.append('strategy', strategy);

    const res = await client.post('/ai/translate/image', form, {
      headers: form.getHeaders(),
    });
    return res.data;
  },

  async retrieveKnowledge(query: string, topK: number = 5, minScore: number = 0.3) {
    const res = await client.post('/ai/retrieve', {
      query,
      top_k: topK,
      min_score: minScore,
    });
    return res.data;
  },

  async runEvaluation(strategies: string[] = ['baseline_lexical', 'rule_nlp', 'rag_grounded']) {
    const res = await client.post('/ai/evaluate', {
      dataset_name: 'core_asl_bench_v1',
      strategies,
    });
    return res.data;
  },

  async getModelStatus() {
    const res = await client.get('/ai/models/status');
    return res.data;
  }
};
