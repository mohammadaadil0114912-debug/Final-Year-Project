import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  Award,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { apiClient } from '../services/api';
import { EvaluationReport, EvaluationStrategyResult } from '../types';

export const ResearchPage: React.FC = () => {
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvaluationData();
  }, []);

  const fetchEvaluationData = async (forceFresh: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getResearchEvaluation(forceFresh);
      setReport(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch evaluation metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrategyBadge = (strat: string) => {
    if (strat === 'rag_grounded') {
      return {
        label: 'System C: NLP + RAG Grounding (Proposed)',
        color: 'bg-brand-100 text-brand-800 dark:bg-brand-800 dark:text-brand-200 border-brand-300'
      };
    }
    if (strat === 'rule_nlp') {
      return {
        label: 'Baseline B: Context-Aware Rule NLP',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-300'
      };
    }
    return {
      label: 'Baseline A: Lexical Dictionary Lookup',
      color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300'
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
            <BarChart2 className="w-4 h-4" />
            <span>Research & Scientific Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Comparative Benchmark Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Empirical evaluation of English-to-ASL intermediate representations on the verified core_asl_bench_v1 corpus.
          </p>
        </div>

        <button
          onClick={() => fetchEvaluationData(true)}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-500 text-xs font-semibold flex items-center space-x-2 shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-500' : ''}`} />
          <span>{isLoading ? 'Running Benchmark...' : 'Re-Run Evaluation Benchmark'}</span>
        </button>
      </div>

      {/* Primary Research Hypothesis */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Core Research Hypothesis Under Evaluation</span>
        </div>
        <p className="text-sm sm:text-base font-medium leading-relaxed max-w-4xl">
          "Retrieval-grounded, context-aware processing improves the quality, grammatical fidelity, and reliability of English-to-ASL intermediate representations compared with a simple dictionary-based word-to-sign baseline."
        </p>
        <div className="text-[11px] text-slate-300 pt-1">
          Benchmark Dataset: <strong className="text-white">core_asl_bench_v1</strong> • Metric suite: Corpus BLEU (1, 2, 4), chrF++, Vocabulary Coverage Rate, and Unsupported Token Frequency.
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs border border-red-200">
          {error}
        </div>
      )}

      {report && (
        <div className="space-y-8 animate-fade-in">
          {/* Comparative Metrics Table */}
          <div className="bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 dark:bg-brand-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Empirical Performance Comparison Table
              </h3>
              <span className="text-[11px] text-slate-400">
                Evaluated at: {new Date(report.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Architecture Strategy</th>
                    <th className="py-3 px-4">BLEU-1</th>
                    <th className="py-3 px-4">BLEU-4</th>
                    <th className="py-3 px-4">chrF++ Score</th>
                    <th className="py-3 px-4">Vocab Coverage</th>
                    <th className="py-3 px-4">Unsupported Rate</th>
                    <th className="py-3 px-4">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {report.results.map((r) => {
                    const badge = getStrategyBadge(r.strategy);
                    const isProposed = r.strategy === 'rag_grounded';
                    return (
                      <tr
                        key={r.strategy}
                        className={`transition-colors ${
                          isProposed ? 'bg-brand-50/40 dark:bg-brand-950/20 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">
                          {r.bleu_1.toFixed(1)}%
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">
                          <span className={isProposed ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}>
                            {r.bleu_4.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">
                          <span className={isProposed ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}>
                            {r.chrf_score.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">
                          {Math.round(r.vocabulary_coverage_rate * 100)}%
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">
                          {Math.round(r.unsupported_output_rate * 100)}%
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {r.avg_latency_ms.toFixed(1)}ms
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Qualitative Analysis Snapshot */}
          <div className="p-5 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              Automated Statistical Analysis
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {report.summaryAnalysis}
            </p>
          </div>

          {/* Qualitative Sample Predictions Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-500" />
              Qualitative Sample Predictions on Gold-Standard Test Prompts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.results
                .find(r => r.strategy === 'rag_grounded')
                ?.sample_outputs.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-4 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono font-bold text-brand-600">{sample.id}</span>
                      <span>BLEU-1: {sample.bleu_1.toFixed(1)}% • chrF: {sample.chrf.toFixed(1)}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Input English:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">"{sample.english}"</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-brand-800/40 space-y-1">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Gold ASL Reference:</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{sample.reference}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">System C Output:</span>
                        <span className="font-mono text-brand-600 dark:text-brand-300 font-bold">{sample.generated}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
