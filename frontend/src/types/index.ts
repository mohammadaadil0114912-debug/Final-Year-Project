export interface SignMedia {
  gloss: string;
  media_url?: string;
  fallback_image?: string;
  thumbnail_url?: string;
  media_type: string;
  source?: string;
  license?: string;
  verified: boolean;
  is_fingerspelled: boolean;
  category?: string;
  non_manual_signal?: string;
}

export interface ConfidenceMetrics {
  overall_label: string;
  vocabulary_coverage: number;
  retrieval_relevance?: number | null;
  model_confidence?: number | null;
  ocr_quality?: number | null;
  speech_confidence?: number | null;
  clarification_needed: boolean;
  clarification_prompt?: string | null;
}

export interface TranslationResult {
  request_id: string;
  original_text: string;
  normalized_text: string;
  tokens: string[];
  keywords: string[];
  asl_gloss: string;
  signs: SignMedia[];
  missing_vocabulary: string[];
  fingerspelled_tokens: string[];
  confidence: ConfidenceMetrics;
  retrieval_evidence: string[];
  processing_method: string;
  limitations_notice: string;
  duration_ms: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'reviewer';
  preferredMode: 'text' | 'speech' | 'image';
  historyRetentionEnabled: boolean;
  contrastTheme: 'standard' | 'high_contrast';
  largeText: boolean;
  createdAt: string;
}

export interface VocabularyItem {
  id: string;
  englishTerm: string;
  aslGloss: string;
  category: string;
  definition: string;
  synonyms: string[];
  media: {
    type: string;
    url: string;
    fallbackImage?: string;
    thumbnailUrl?: string;
    source?: string;
    license?: string;
    verified: boolean;
  };
  nonManualSignal?: string;
  reviewStatus: 'approved' | 'flagged' | 'deprecated' | 'pending';
  reviewer?: string;
  version: string;
}

export interface SavedPhrase {
  id: string;
  userId: string;
  englishText: string;
  aslGloss: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  userId?: string;
  inputType: 'text' | 'speech' | 'image';
  inputText: string;
  strategy: string;
  aslGloss: string;
  signsCount: number;
  coverage: number;
  overallLabel: string;
  durationMs: number;
  createdAt: string;
}

export interface EvaluationStrategyResult {
  strategy: string;
  total_samples: number;
  bleu_1: number;
  bleu_2: number;
  bleu_4: number;
  chrf_score: number;
  vocabulary_coverage_rate: number;
  unsupported_output_rate: number;
  avg_latency_ms: number;
  sample_outputs: Array<{
    id: string;
    english: string;
    reference: string;
    generated: string;
    bleu_1: number;
    chrf: number;
    coverage: number;
  }>;
}

export interface EvaluationReport {
  id: string;
  datasetName: string;
  strategies: string[];
  results: EvaluationStrategyResult[];
  summaryAnalysis: string;
  createdAt: string;
}
