import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  UploadCloud, 
  Trash2, 
  Send, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { apiClient } from '../services/api';
import { TranslationResult } from '../types';
import { SignSequenceViewer } from '../components/viewer/SignSequenceViewer';
import { ConfidenceCard } from '../components/viewer/ConfidenceCard';
import { FeedbackModal } from '../components/feedback/FeedbackModal';

export const ImageToSignPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [ocrEngineNotice, setOcrEngineNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError(`Unsupported file type: ${file.type}. Please upload JPG, PNG, or WebP.`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setExtractedText('');
    setTranslationResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleOCRAndTranslate = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.translateImage(selectedFile, 'rag_grounded');
      if (res.ocr_result) {
        setExtractedText(res.ocr_result.extracted_text || '');
        if (res.ocr_result.notice) {
          setOcrEngineNotice(res.ocr_result.notice);
        }
      }
      if (res.translation) {
        setTranslationResult(res.translation);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to extract text or translate image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetranslateEditedText = async () => {
    if (!extractedText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.translateText(extractedText.trim(), 'rag_grounded');
      setTranslationResult(res);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Translation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Workspace Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
          <ImageIcon className="w-4 h-4" />
          <span>Core Feature C</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Image-to-Sign AI (OCR) Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Upload notices, documents, or signs containing English text to extract and synthesize verified ASL representations.
        </p>
      </div>

      {/* Scope Transparency Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-start space-x-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
        <span>
          <strong>Linguistic Scope:</strong> This module extracts printed or handwritten text embedded within images (OCR). It does not classify human signers or bodily gestures from static photographs.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Upload & OCR Pane (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            {/* Drag & Drop Zone */}
            {!previewUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 rounded-2xl p-8 text-center cursor-pointer transition-colors space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-800 text-brand-600 mx-auto flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to browse or drag & drop image
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, WebP (Up to 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 max-h-56 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="max-h-56 w-full object-contain"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setExtractedText('');
                      setTranslationResult(null);
                    }}
                    title="Remove Image"
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                  <span>{selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : ''}</span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* OCR Extract & Translate Button */}
            {previewUrl && !extractedText && (
              <button
                type="button"
                onClick={handleOCRAndTranslate}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-2"
              >
                {isLoading ? <span>Running OCR Engine...</span> : <span>Extract Text & Translate to Signs</span>}
              </button>
            )}

            {/* Editable OCR Result Pane */}
            {extractedText && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Extracted OCR Text (Editable)</span>
                  <span className="text-[10px] text-brand-600 font-medium">Verify before translating</span>
                </label>
                <textarea
                  rows={3}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-800/40 text-slate-900 dark:text-white text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={handleRetranslateEditedText}
                  disabled={isLoading || !extractedText.trim()}
                  className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Update ASL Translation</span>
                </button>
              </div>
            )}

            {ocrEngineNotice && (
              <p className="text-[10px] text-slate-400 italic">
                {ocrEngineNotice}
              </p>
            )}
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
              <SignSequenceViewer
                signs={translationResult.signs}
                aslGloss={translationResult.asl_gloss}
                originalText={translationResult.original_text}
                onRequestFeedback={() => setFeedbackOpen(true)}
              />

              <ConfidenceCard
                confidence={translationResult.confidence}
                processingMethod={translationResult.processing_method}
                durationMs={translationResult.duration_ms}
                retrievalEvidence={translationResult.retrieval_evidence}
              />
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-brand-900 border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 space-y-2">
              <ImageIcon className="w-8 h-8 text-brand-400 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Image Pipeline Ready</h4>
              <p className="text-xs max-w-sm mx-auto">
                Upload an image on the left to extract textual information and render an ASL sign sequence.
              </p>
            </div>
          )}
        </div>
      </div>

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
