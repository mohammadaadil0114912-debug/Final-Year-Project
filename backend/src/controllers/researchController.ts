import { Request, Response } from 'express';
import { aiClient } from '../services/aiClient.js';
import { store } from '../services/store.js';
import { IEvaluationRun } from '../models/types.js';

export const researchController = {
  async getEvaluation(req: Request, res: Response) {
    try {
      const { forceFresh } = req.query;

      // Check if we have a recent evaluation run
      if (!forceFresh && store.evaluations.size > 0) {
        const latest = Array.from(store.evaluations.values())[store.evaluations.size - 1];
        return res.json({ success: true, data: latest });
      }

      // Run live evaluation benchmark via FastAPI AI service
      const evalData = await aiClient.runEvaluation();
      const id = `eval-run-${Date.now()}`;
      const runRecord: IEvaluationRun = {
        id,
        datasetName: evalData.dataset_name || 'core_asl_bench_v1',
        strategies: ['baseline_lexical', 'rule_nlp', 'rag_grounded'],
        results: evalData.results,
        summaryAnalysis: evalData.summary_analysis,
        createdAt: evalData.evaluated_at || new Date().toISOString()
      };

      store.evaluations.set(id, runRecord);
      return res.json({ success: true, data: runRecord });
    } catch (err: any) {
      console.error('[Research Evaluation Error]', err.message);
      return res.status(502).json({
        success: false,
        error: 'Failed to run research evaluation.',
        details: err.message
      });
    }
  }
};
