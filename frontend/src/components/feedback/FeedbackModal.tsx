import React, { useState } from 'react';
import { Flag, X, Check } from 'lucide-react';
import { apiClient } from '../../services/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId?: string;
  inputText?: string;
  aslGloss?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  requestId,
  inputText = '',
  aslGloss = ''
}) => {
  const [category, setCategory] = useState<string>('inaccurate_gloss');
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.submitFeedback({
        requestId,
        inputText,
        aslGloss,
        issueCategory: category,
        comments
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-brand-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 mb-2">
          <Flag className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Report Linguistic or Media Inaccuracy
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Help our research team improve ASL translation fidelity by flagging incorrect glosses or missing vocabulary.
        </p>

        {submitted ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Thank You!</h4>
            <p className="text-xs text-slate-500">Your feedback has been routed to the ASL Review Queue.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-600 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-800 text-slate-900 dark:text-white"
              >
                <option value="inaccurate_gloss">Inaccurate ASL Gloss Sequence</option>
                <option value="missing_sign">Missing or Untranslated Sign</option>
                <option value="grammar_error">Grammar / Non-Manual Marker Error</option>
                <option value="inappropriate_media">Broken or Inaccurate Sign Media</option>
                <option value="other">Other Linguistic Feedback</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Linguistic Comments or Suggested Correction
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Describe how the sign or gloss should be corrected..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-brand-800/40 font-mono text-[11px] text-slate-600 dark:text-slate-400">
              <div>Input: {inputText || 'N/A'}</div>
              <div>Gloss: {aslGloss || 'N/A'}</div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
