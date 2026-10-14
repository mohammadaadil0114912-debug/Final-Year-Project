import React, { useState } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Send, 
  Bookmark, 
  Check, 
  Layers, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../services/api';
import { TranslationResult } from '../types';
import { SignSequenceViewer } from '../components/viewer/SignSequenceViewer';
import { ConfidenceCard } from '../components/viewer/ConfidenceCard';
import { FeedbackModal } from '../components/feedback/FeedbackModal';

const EXAMPLE_PROMPTS = [
  "Hello, what is your name?",
  "Where is the nearest hospital?",
  "I will see the doctor tomorrow.",
  "Please help me, I do not understand.",
  "Can you please write it down?"
];

export const TextToSignPage: React.FC = () => {
  const [inputText, setInputText] = useState<string>('Where is the nearest hospital?');
  const [strategy, setStrategy] = useState<string>('rag_grounded');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedPhraseSuccess, setSavedPhraseSuccess] = useState<boolean>(false);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);

  const handleTranslate = async (textToRun?: string) => {
    const text = textToRun || inputText;
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.translateText(text.trim(), strategy);
      setTranslationResult(res);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to translation pipeline.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToPhrases = async () => {
    if (!translationResult) return;
    try {
      await apiClient.createPhrase({
        englishText: translationResult.original_text,
        aslGloss: translationResult.asl_gloss,
        category: 'custom',
        isFavorite: true
      });
      setSavedPhraseSuccess(true);
      setTimeout(() => setSavedPhraseSuccess(false), 2000);
    } catch (err) {
      // Non-blocking if guest
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Workspace Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Core Feature A</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Text-to-Sign AI Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Transform English prose into syntactically restructured ASL glosses aligned with verified educational sign media.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Pane (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="english-input" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                English Input Text
              </label>
              <span className="text-xs text-slate-400">
                {inputText.length}/1000 characters
              </span>
            </div>

            <textarea
              id="english-input"
              rows={4}
              maxLength={1000}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type English sentences here..."
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800/40 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-brand-800 transition-colors"
            />

            {/* Translation Strategy Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Translation Pipeline Strategy:</span>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase">
                  {strategy === 'rag_grounded' ? 'Research System C' : strategy === 'rule_nlp' ? 'Baseline B' : 'Baseline A'}
                </span>
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="rag_grounded">System C: Context-Aware NLP + RAG Grounding (Recommended)</option>
                <option value="rule_nlp">Baseline B: Context-Aware Rule NLP (No RAG)</option>
                <option value="baseline_lexical">Baseline A: Word-to-Sign Dictionary Lookup</option>
              </select>
            </div>

            {/* Controls Toolbar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-xs flex items-center space-x-1 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={() => handleTranslate()}
                disabled={isLoading || !inputText.trim()}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-2 shadow-sm transition-all"
              >
                {isLoading ? (
                  <span>Processing NLP...</span>
                ) : (
                  <>
                    <span>Translate to ASL</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Example Sentences */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-brand-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Example Phrases (Click to Test)
            </h3>
            <div className="flex flex-col space-y-1.5">
              {EXAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(prompt);
                    handleTranslate(prompt);
                  }}
                  className="text-left text-xs p-2 rounded-lg bg-white dark:bg-brand-800 hover:border-brand-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">{prompt}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-brand-500 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Pane (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          {translationResult ? (
            <div className="space-y-6 animate-fade-in">
              {/* Media Sequence Viewer */}
              <SignSequenceViewer
                signs={translationResult.signs}
                aslGloss={translationResult.asl_gloss}
                originalText={translationResult.original_text}
                onRequestFeedback={() => setFeedbackOpen(true)}
              />

              {/* Linguistic Decomposition Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Linguistic Pipeline Breakdown
                  </h4>
                  <button
                    onClick={handleSaveToPhrases}
                    className="text-xs flex items-center space-x-1 text-brand-600 hover:text-brand-700 font-semibold"
                  >
                    {savedPhraseSuccess ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>{savedPhraseSuccess ? 'Saved!' : 'Save Phrase'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Normalized English:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono">
                      {translationResult.normalized_text}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Extracted Keywords:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {translationResult.keywords.join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Processing Method:</span>
                    <span className="text-brand-600 font-semibold">
                      {translationResult.processing_method}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Missing / Unsupported Terms:</span>
                    <span className="text-amber-600 font-medium">
                      {translationResult.missing_vocabulary.length > 0
                        ? translationResult.missing_vocabulary.join(', ')
                        : 'None (Full catalog coverage)'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                  Notice: {translationResult.limitations_notice}
                </div>
              </div>

              {/* Confidence Diagnostics Card */}
              <ConfidenceCard
                confidence={translationResult.confidence}
                processingMethod={translationResult.processing_method}
                durationMs={translationResult.duration_ms}
                retrievalEvidence={translationResult.retrieval_evidence}
              />
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-brand-900 border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-brand-400 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ready to Translate</h4>
              <p className="text-xs max-w-sm mx-auto">
                Enter an English phrase or select an example above to generate an ASL gloss sequence and sign media playback.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        requestId={translationResult?.request_id}
        inputText={translationResult?.original_text}
        aslGloss={translationResult?.asl_gloss}
      />
    </div>
  );
};
