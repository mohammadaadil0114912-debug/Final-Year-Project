export interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'admin' | 'reviewer';
  preferredMode: 'text' | 'speech' | 'image';
  historyRetentionEnabled: boolean;
  contrastTheme: 'standard' | 'high_contrast';
  largeText: boolean;
  createdAt: string;
}

export interface ITranslationHistory {
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

export interface IVocabularyItem {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ISavedPhrase {
  id: string;
  userId: string;
  englishText: string;
  aslGloss: string;
  category: 'assistance' | 'medical' | 'greetings' | 'questions' | 'custom';
  isFavorite: boolean;
  createdAt: string;
}

export interface IFeedback {
  id: string;
  userId?: string;
  requestId: string;
  inputText: string;
  aslGloss: string;
  issueCategory: 'inaccurate_gloss' | 'missing_sign' | 'grammar_error' | 'inappropriate_media' | 'other';
  comments: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface IEvaluationRun {
  id: string;
  datasetName: string;
  strategies: string[];
  results: any[];
  summaryAnalysis: string;
  createdAt: string;
}
