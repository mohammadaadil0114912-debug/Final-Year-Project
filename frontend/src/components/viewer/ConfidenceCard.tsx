import React from 'react';
import { ShieldCheck, AlertCircle, Sparkles, HelpCircle, FileSearch, Mic, Image } from 'lucide-react';
import { ConfidenceMetrics } from '../../types';

interface ConfidenceCardProps {
  confidence: ConfidenceMetrics;
  processingMethod?: string;
  durationMs?: number;
  retrievalEvidence?: string[];
}

export const ConfidenceCard: React.FC<ConfidenceCardProps> = ({
  confidence,
  processingMethod,
  durationMs,
  retrievalEvidence
}) => {
  const getBadgeColor = (label: string) => {
    if (label.includes('Verified')) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800';
    if (label.includes('Partial')) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800';
    return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800';
  };

  return (
    <div className="bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
      {/* Header and Classification Label */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            AI Transparency & Confidence Diagnostics
          </h4>
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border mt-1.5 ${getBadgeColor(confidence.overall_label)}`}>
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            {confidence.overall_label}
          </span>
        </div>
        {durationMs !== undefined && (
          <span className="text-xs text-slate-400 font-mono">
            Latency: {durationMs}ms
          </span>
        )}
      </div>

      {/* Disaggregated Quality Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Vocabulary Coverage */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/50">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Vocabulary Coverage</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {Math.round(confidence.vocabulary_coverage * 100)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Verified sign assets</div>
        </div>

        {/* Model Alignment Confidence */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/50">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Syntactic Alignment</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {confidence.model_confidence ? `${Math.round(confidence.model_confidence * 100)}%` : 'Rule Grounded'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Grammar consistency</div>
        </div>

        {/* Retrieval Relevance */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/50">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">RAG Relevance</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {confidence.retrieval_relevance ? `${Math.round(confidence.retrieval_relevance * 100)}%` : 'Exact Lookup'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Vector similarity</div>
        </div>

        {/* Speech Confidence (if provided) */}
        {confidence.speech_confidence !== null && confidence.speech_confidence !== undefined && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/50">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Mic className="w-3 h-3 text-brand-500" /> Speech Audio
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {Math.round(confidence.speech_confidence * 100)}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Acoustic clarity</div>
          </div>
        )}

        {/* OCR Quality (if provided) */}
        {confidence.ocr_quality !== null && confidence.ocr_quality !== undefined && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-800/40 border border-slate-200 dark:border-slate-700/50">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Image className="w-3 h-3 text-brand-500" /> OCR Extraction
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {Math.round(confidence.ocr_quality * 100)}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Character confidence</div>
          </div>
        )}
      </div>

      {/* Clarification prompt if ambiguous */}
      {confidence.clarification_needed && confidence.clarification_prompt && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2">
          <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <strong className="font-semibold block">Clarification Suggested:</strong>
            {confidence.clarification_prompt}
          </div>
        </div>
      )}

      {/* RAG Evidence Provenance */}
      {retrievalEvidence && retrievalEvidence.length > 0 && (
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <FileSearch className="w-3 h-3" /> Grounded Knowledge Evidence IDs:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {retrievalEvidence.map((id) => (
              <span
                key={id}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
