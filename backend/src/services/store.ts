import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { IUser, ITranslationHistory, IVocabularyItem, ISavedPhrase, IFeedback, IEvaluationRun } from '../models/types.js';

class InMemoryStore {
  public users: Map<string, IUser> = new Map();
  public history: Map<string, ITranslationHistory> = new Map();
  public vocabulary: Map<string, IVocabularyItem> = new Map();
  public phrases: Map<string, ISavedPhrase> = new Map();
  public feedback: Map<string, IFeedback> = new Map();
  public evaluations: Map<string, IEvaluationRun> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // 1. Seed demo and admin accounts
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('password123', salt);
    const adminPasswordHash = bcrypt.hashSync('admin123', salt);

    const demoUser: IUser = {
      id: 'user-demo-001',
      email: 'demo@aslbridge.ai',
      passwordHash: demoPasswordHash,
      name: 'Accessibility Researcher',
      role: 'user',
      preferredMode: 'text',
      historyRetentionEnabled: true,
      contrastTheme: 'standard',
      largeText: false,
      createdAt: new Date().toISOString()
    };

    const adminUser: IUser = {
      id: 'user-admin-001',
      email: 'admin@aslbridge.ai',
      passwordHash: adminPasswordHash,
      name: 'ASL Review Administrator',
      role: 'admin',
      preferredMode: 'text',
      historyRetentionEnabled: true,
      contrastTheme: 'standard',
      largeText: false,
      createdAt: new Date().toISOString()
    };

    this.users.set(demoUser.id, demoUser);
    this.users.set(adminUser.id, adminUser);

    // 2. Seed vocabulary from datasets/asl_vocabulary.json
    try {
      const vocabPath = path.resolve(process.cwd(), '../datasets/asl_vocabulary.json');
      const altPath = path.resolve(process.cwd(), 'datasets/asl_vocabulary.json');
      const targetPath = fs.existsSync(vocabPath) ? vocabPath : altPath;

      if (fs.existsSync(targetPath)) {
        const raw = fs.readFileSync(targetPath, 'utf-8');
        const items = JSON.parse(raw);
        for (const item of items) {
          const vocabEntry: IVocabularyItem = {
            id: item.id,
            englishTerm: item.english_term,
            aslGloss: item.asl_gloss,
            category: item.category || 'general',
            definition: item.definition || '',
            synonyms: item.synonyms || [],
            media: {
              type: item.media?.type || 'video',
              url: item.media?.url || '',
              fallbackImage: item.media?.fallback_image,
              thumbnailUrl: item.media?.thumbnail_url,
              source: item.media?.source,
              license: item.media?.license,
              verified: item.media?.verified ?? true
            },
            nonManualSignal: item.non_manual_signal,
            reviewStatus: item.review_status || 'approved',
            reviewer: item.reviewer,
            version: item.version || '1.0.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          this.vocabulary.set(vocabEntry.id, vocabEntry);
        }
      }
    } catch (e) {
      console.warn('[Store] Could not auto-seed vocabulary from disk:', e);
    }

    // 3. Seed emergency and assistance default phrases
    const defaultPhrases: Array<Omit<ISavedPhrase, 'id' | 'createdAt'>> = [
      {
        userId: 'user-demo-001',
        englishText: 'Please help me, I need a doctor.',
        aslGloss: 'PLEASE HELP ME DOCTOR I NEED',
        category: 'medical',
        isFavorite: true
      },
      {
        userId: 'user-demo-001',
        englishText: 'I need an ASL interpreter.',
        aslGloss: 'ASL INTERPRETER I NEED',
        category: 'assistance',
        isFavorite: true
      },
      {
        userId: 'user-demo-001',
        englishText: 'Can you please write it down?',
        aslGloss: 'PLEASE WRITE YOU {yn_q}',
        category: 'assistance',
        isFavorite: true
      },
      {
        userId: 'user-demo-001',
        englishText: 'Where is the bathroom?',
        aslGloss: 'BATHROOM WHERE {q}',
        category: 'questions',
        isFavorite: false
      },
      {
        userId: 'user-demo-001',
        englishText: 'Hello, nice to meet you.',
        aslGloss: 'HELLO NICE MEET YOU',
        category: 'greetings',
        isFavorite: false
      }
    ];

    defaultPhrases.forEach((p, idx) => {
      const id = `phrase-default-${idx + 1}`;
      this.phrases.set(id, {
        id,
        ...p,
        createdAt: new Date().toISOString()
      });
    });

    // 4. Load persisted benchmark evaluation run if present on disk
    try {
      const evalPath = path.resolve(process.cwd(), '../datasets/latest_evaluation.json');
      const altEvalPath = path.resolve(process.cwd(), 'datasets/latest_evaluation.json');
      const targetEvalPath = fs.existsSync(evalPath) ? evalPath : altEvalPath;

      if (fs.existsSync(targetEvalPath)) {
        const rawEval = fs.readFileSync(targetEvalPath, 'utf-8');
        const runRecord: IEvaluationRun = JSON.parse(rawEval);
        if (runRecord && runRecord.id) {
          this.evaluations.set(runRecord.id, runRecord);
        }
      }
    } catch (e) {
      console.warn('[Store] Could not load persisted evaluation run from disk:', e);
    }
  }
}

export const store = new InMemoryStore();
